"""Scaffold — KS Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class KansasScraper(BaseScraper):
    source_state = "KS"
    source_url = "https://www.google.com/search?q=KS+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("KS: scaffold only — add HTTP client / export parser for this state.")
        return []
