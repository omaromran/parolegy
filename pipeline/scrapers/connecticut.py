"""Scaffold — CT Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class ConnecticutScraper(BaseScraper):
    source_state = "CT"
    source_url = "https://www.google.com/search?q=CT+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("CT: scaffold only — add HTTP client / export parser for this state.")
        return []
