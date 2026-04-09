"""Scaffold — NH Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class NewHampshireScraper(BaseScraper):
    source_state = "NH"
    source_url = "https://www.google.com/search?q=NH+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("NH: scaffold only — add HTTP client / export parser for this state.")
        return []
