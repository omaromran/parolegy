"""Scaffold — VT Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class VermontScraper(BaseScraper):
    source_state = "VT"
    source_url = "https://www.google.com/search?q=VT+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("VT: scaffold only — add HTTP client / export parser for this state.")
        return []
