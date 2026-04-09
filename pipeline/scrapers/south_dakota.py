"""Scaffold — SD Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class SouthDakotaScraper(BaseScraper):
    source_state = "SD"
    source_url = "https://www.google.com/search?q=SD+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("SD: scaffold only — add HTTP client / export parser for this state.")
        return []
