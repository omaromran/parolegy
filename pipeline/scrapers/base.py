from __future__ import annotations

import logging
import os
import random
import time
from abc import ABC, abstractmethod
from typing import Any

import httpx

DEFAULT_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)


class ScraperFailure(Exception):
    """Raised when a scraper cannot complete (network, parse, or zero rows when data expected)."""


class BaseScraper(ABC):
    """Shared HTTP client, retries, delays, and structured logging."""

    source_state: str
    source_url: str

    def __init__(self) -> None:
        self.logger = logging.getLogger(self.__class__.__name__)
        self._timeout = float(os.environ.get("PIPELINE_HTTP_TIMEOUT", "60"))
        self._max_retries = int(os.environ.get("PIPELINE_HTTP_RETRIES", "3"))
        self._retry_backoff = float(os.environ.get("PIPELINE_RETRY_BACKOFF_SEC", "2"))
        self._min_delay = float(os.environ.get("PIPELINE_MIN_DELAY_SEC", "0.35"))
        self._max_delay = float(os.environ.get("PIPELINE_MAX_DELAY_SEC", "1.2"))
        self._client: httpx.Client | None = None

    def _jitter_delay(self) -> None:
        time.sleep(random.uniform(self._min_delay, self._max_delay))

    def client(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(
                timeout=self._timeout,
                headers={"User-Agent": os.environ.get("PIPELINE_USER_AGENT", DEFAULT_UA)},
                follow_redirects=True,
            )
        return self._client

    def close(self) -> None:
        if self._client is not None:
            self._client.close()
            self._client = None

    def __enter__(self) -> BaseScraper:
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()

    def request(
        self,
        method: str,
        url: str,
        *,
        expect_json: bool = False,
        **kwargs: Any,
    ) -> httpx.Response:
        last_err: Exception | None = None
        for attempt in range(1, self._max_retries + 1):
            self._jitter_delay()
            try:
                resp = self.client().request(method, url, **kwargs)
                resp.raise_for_status()
                if expect_json:
                    resp.json()
                return resp
            except Exception as e:
                last_err = e
                self.logger.warning("HTTP attempt %s/%s failed: %s", attempt, self._max_retries, e)
                if attempt < self._max_retries:
                    time.sleep(self._retry_backoff * attempt)
        raise ScraperFailure(f"HTTP failed after {self._max_retries} attempts: {last_err}") from last_err

    @abstractmethod
    def run(self) -> list[dict[str, Any]]:
        """Return raw rows (pre-normalizer) matching the unified schema fields where possible."""

    def raw_record(
        self,
        *,
        full_name: str = "",
        first_name: str = "",
        last_name: str = "",
        inmate_id: str = "",
        facility: str = "",
        facility_address: str = "",
        city: str = "",
        state: str = "",
        zip_code: str = "",
        offense: str = "",
        sentence_start_date: str = "",
        projected_release_date: str = "",
        source_url: str | None = None,
    ) -> dict[str, Any]:
        return {
            "full_name": full_name,
            "first_name": first_name,
            "last_name": last_name,
            "inmate_id": inmate_id,
            "facility": facility,
            "facility_address": facility_address,
            "city": city,
            "state": state,
            "zip_code": zip_code,
            "offense": offense,
            "sentence_start_date": sentence_start_date,
            "projected_release_date": projected_release_date,
            "source_state": self.source_state,
            "source_url": source_url or self.source_url,
        }
