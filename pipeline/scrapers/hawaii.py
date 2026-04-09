"""Scaffold — HI Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class HawaiiScraper(BaseScraper):
    source_state = "HI"
    source_url = "https://www.google.com/search?q=HI+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("HI: scaffold only — add HTTP client / export parser for this state.")
        return []
