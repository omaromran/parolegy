"""Georgia GDC offender query — HTML form flow on services.gdc.ga.gov (no public bulk API).

List results only include name, offense, and institution; projected release lives on per-offender
detail ("View Offender Info") and is not fetched here to avoid one HTTP request per inmate.
"""

from __future__ import annotations

import logging
import os
import re
import time
from typing import Any

import httpx
from bs4 import BeautifulSoup

from .base import BaseScraper
from .federal_bop import DEFAULT_SURNAMES

logger = logging.getLogger(__name__)

BASE = "https://services.gdc.ga.gov/GDC/OffenderQuery/jsp/"
DISCLAIMER_URL = BASE + "OffQryForm.jsp?Institution="
REDIRECTOR = BASE + "OffQryRedirector.jsp"


def _parse_name_gdc(raw: str) -> tuple[str, str, str]:
    """SMITH, AARON J -> (AARON J SMITH, AARON J, SMITH)"""
    raw = " ".join(raw.split())
    if "," in raw:
        last, rest = raw.split(",", 1)
        last = last.strip()
        first = rest.strip()
        full = f"{first} {last}".strip()
        return full, first, last
    return raw, "", ""


def parse_results_html(html: str) -> list[dict[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    rows: list[dict[str, str]] = []
    for form in soup.select('form[name^="fm"]'):
        rec_in = form.find("input", {"name": "vRecNo"})
        if not rec_in or not rec_in.get("value"):
            continue
        rec_no = str(rec_in["value"]).strip().lstrip("0") or str(rec_in["value"]).strip()
        name_raw = ""
        offense = ""
        facility = ""
        for cell in form.select(".TableCell"):
            strong = cell.find("strong")
            if not strong:
                continue
            label = strong.get_text(strip=True)
            b = cell.find("b")
            if not b:
                continue
            val = b.get_text(strip=True)
            if "Offender Name" in label:
                name_raw = val
            elif "Major Offense" in label:
                offense = val
            elif "Current Institution" in label:
                facility = val
        if name_raw:
            rows.append(
                {
                    "rec_no": rec_no,
                    "name_raw": name_raw,
                    "offense": offense,
                    "facility": facility,
                }
            )
    return rows


def page_info(html: str) -> tuple[int, int] | None:
    m = re.search(r"Page\s+(\d+)\s+of\s+(\d+)", html)
    if not m:
        return None
    return int(m.group(1)), int(m.group(2))


class GeorgiaScraper(BaseScraper):
    source_state = "GA"
    source_url = "https://services.gdc.ga.gov/GDC/OffenderQuery/jsp/OffQryForm.jsp"

    def _accept_disclaimer(self, client: httpx.Client) -> None:
        r = client.post(
            DISCLAIMER_URL,
            data={
                "vDisclaimer": "True",
                "submit2": "I agree - Go to the Offender Query",
            },
            timeout=60,
        )
        r.raise_for_status()

    def _reset_query_session(self, client: httpx.Client) -> None:
        """GDC JSP session stays in pagination mode; new surname searches fail until form is re-entered."""
        client.get(DISCLAIMER_URL, timeout=60)
        self._accept_disclaimer(client)

    def _search_last_name(
        self,
        client: httpx.Client,
        last_name: str,
        records_per_page: str,
    ) -> str:
        data = {
            "vIsCookieEnabled": "Y",
            "vLastName": last_name,
            "vFirstName": "",
            "vGender": "",
            "vRace": "",
            "vAgeLow": "",
            "vAgeHigh": "",
            "vCurrentInstitution": "",
            "vOutput": "Detailed",
            "RecordsPerPage": records_per_page,
            "vDetailFormat": "Summary",
            "NextPage": "2",
        }
        r = client.post(REDIRECTOR, data=data, timeout=120)
        r.raise_for_status()
        return r.text

    def _next_page(self, client: httpx.Client) -> str:
        retries = int(os.environ.get("GA_NEXT_PAGE_RETRIES", "3"))
        backoff = float(os.environ.get("GA_RETRY_BACKOFF_SEC", "2"))
        last: Exception | None = None
        for attempt in range(retries):
            try:
                r = client.post(
                    REDIRECTOR,
                    data={"NextPage": "7", "Action": ">"},
                    timeout=120,
                )
                r.raise_for_status()
                return r.text
            except httpx.HTTPStatusError as e:
                last = e
                if e.response.status_code >= 500 and attempt + 1 < retries:
                    time.sleep(backoff * (attempt + 1))
                    continue
                raise
        raise last  # pragma: no cover

    def run(self) -> list[dict[str, Any]]:
        surnames_raw = os.environ.get("GA_SURNAMES", "").strip()
        if surnames_raw:
            surnames = [s for s in surnames_raw.replace(",", " ").split() if s]
        else:
            surnames = list(DEFAULT_SURNAMES)
        max_surnames = int(os.environ.get("GA_MAX_SURNAMES", "25"))
        max_pages = int(os.environ.get("GA_MAX_PAGES_PER_SURNAME", "50"))
        max_rows = int(os.environ.get("GA_MAX_ROWS_TOTAL", "50000"))
        records_per_page = os.environ.get("GA_RECORDS_PER_PAGE", "45")
        if records_per_page not in ("9", "18", "27", "36", "45"):
            records_per_page = "45"

        surnames = surnames[:max_surnames]
        seen: set[str] = set()
        out: list[dict[str, Any]] = []

        headers = {
            "User-Agent": self.client().headers.get("User-Agent", "Mozilla/5.0"),
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
        }
        with httpx.Client(follow_redirects=True, headers=headers, timeout=120) as client:
            for ln in surnames:
                if len(out) >= max_rows:
                    break
                self._jitter_delay()
                try:
                    self._reset_query_session(client)
                    html = self._search_last_name(client, ln, records_per_page)
                except Exception as e:
                    logger.warning("GA search failed for last name %s: %s", ln, e)
                    continue
                if "RESULTS:" not in html and "Offender Name" not in html:
                    logger.debug("GA: no results block for %s", ln)
                    continue
                page_count = 0
                while page_count < max_pages and len(out) < max_rows:
                    for row in parse_results_html(html):
                        key = row["rec_no"]
                        if key in seen:
                            continue
                        seen.add(key)
                        full, fn, last = _parse_name_gdc(row["name_raw"])
                        out.append(
                            self.raw_record(
                                full_name=full,
                                first_name=fn,
                                last_name=last,
                                inmate_id=key,
                                facility=row["facility"],
                                offense=row["offense"],
                                sentence_start_date="",
                                projected_release_date="",
                                source_url=self.source_url,
                            )
                        )
                        if len(out) >= max_rows:
                            break
                    info = page_info(html)
                    if not info:
                        break
                    cur, total = info
                    if cur >= total:
                        break
                    self._jitter_delay()
                    try:
                        html = self._next_page(client)
                    except Exception as e:
                        logger.warning("GA pagination failed after %s page %s: %s", ln, cur, e)
                        break
                    page_count += 1

        logger.info("Georgia GDC: %s unique rows (surnames tried: %s)", len(out), len(surnames))
        return out
