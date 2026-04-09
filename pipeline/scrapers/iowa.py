"""Scaffold — IA Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class IowaScraper(BaseScraper):
    source_state = "IA"
    source_url = "https://www.google.com/search?q=IA+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("IA: scaffold only — add HTTP client / export parser for this state.")
        return []
