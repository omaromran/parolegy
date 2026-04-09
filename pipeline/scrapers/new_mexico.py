"""Scaffold — NM Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class NewMexicoScraper(BaseScraper):
    source_state = "NM"
    source_url = "https://www.google.com/search?q=NM+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("NM: scaffold only — add HTTP client / export parser for this state.")
        return []
