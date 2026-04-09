"""Scaffold — WA Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class WashingtonScraper(BaseScraper):
    source_state = "WA"
    source_url = "https://www.google.com/search?q=WA+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("WA: scaffold only — add HTTP client / export parser for this state.")
        return []
