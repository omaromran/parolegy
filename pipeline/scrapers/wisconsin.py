"""Scaffold — WI Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class WisconsinScraper(BaseScraper):
    source_state = "WI"
    source_url = "https://www.google.com/search?q=WI+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("WI: scaffold only — add HTTP client / export parser for this state.")
        return []
