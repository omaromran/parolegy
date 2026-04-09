"""Scaffold — DC Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class DistrictOfColumbiaScraper(BaseScraper):
    source_state = "DC"
    source_url = "https://www.google.com/search?q=DC+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("DC: scaffold only — add HTTP client / export parser for this state.")
        return []
