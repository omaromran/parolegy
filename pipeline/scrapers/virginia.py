"""Scaffold — VA Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class VirginiaScraper(BaseScraper):
    source_state = "VA"
    source_url = "https://www.google.com/search?q=VA+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("VA: scaffold only — add HTTP client / export parser for this state.")
        return []
