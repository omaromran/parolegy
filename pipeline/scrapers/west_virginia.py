"""Scaffold — WV Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class WestVirginiaScraper(BaseScraper):
    source_state = "WV"
    source_url = "https://www.google.com/search?q=WV+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("WV: scaffold only — add HTTP client / export parser for this state.")
        return []
