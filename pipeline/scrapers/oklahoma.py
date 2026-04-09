"""Scaffold — OK Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class OklahomaScraper(BaseScraper):
    source_state = "OK"
    source_url = "https://www.google.com/search?q=OK+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("OK: scaffold only — add HTTP client / export parser for this state.")
        return []
