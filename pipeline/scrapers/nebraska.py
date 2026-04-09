"""Scaffold — NE Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class NebraskaScraper(BaseScraper):
    source_state = "NE"
    source_url = "https://www.google.com/search?q=NE+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("NE: scaffold only — add HTTP client / export parser for this state.")
        return []
