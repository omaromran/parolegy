"""Scaffold — ND Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class NorthDakotaScraper(BaseScraper):
    source_state = "ND"
    source_url = "https://www.google.com/search?q=ND+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("ND: scaffold only — add HTTP client / export parser for this state.")
        return []
