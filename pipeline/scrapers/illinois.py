"""Scaffold — IL Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class IllinoisScraper(BaseScraper):
    source_state = "IL"
    source_url = "https://www.google.com/search?q=IL+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("IL: scaffold only — add HTTP client / export parser for this state.")
        return []
