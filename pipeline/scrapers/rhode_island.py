"""Scaffold — RI Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class RhodeIslandScraper(BaseScraper):
    source_state = "RI"
    source_url = "https://www.google.com/search?q=RI+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("RI: scaffold only — add HTTP client / export parser for this state.")
        return []
