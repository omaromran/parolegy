"""Scaffold — SC Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class SouthCarolinaScraper(BaseScraper):
    source_state = "SC"
    source_url = "https://www.google.com/search?q=SC+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("SC: scaffold only — add HTTP client / export parser for this state.")
        return []
