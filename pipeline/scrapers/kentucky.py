"""Scaffold — KY Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class KentuckyScraper(BaseScraper):
    source_state = "KY"
    source_url = "https://www.google.com/search?q=KY+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("KY: scaffold only — add HTTP client / export parser for this state.")
        return []
