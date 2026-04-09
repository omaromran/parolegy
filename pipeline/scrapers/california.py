"""California CDCR — CIRIS is a SPA; consider Playwright or an official machine-readable export if published."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class CaliforniaScraper(BaseScraper):
    source_state = "CA"
    source_url = "https://ciris.mt.cdcr.ca.gov/"

    def run(self) -> list[dict]:
        logger.warning("California: implement CIRIS automation or CDCR-published data feed.")
        return []
