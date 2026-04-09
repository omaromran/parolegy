"""Scaffold — WY Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class WyomingScraper(BaseScraper):
    source_state = "WY"
    source_url = "https://www.google.com/search?q=WY+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("WY: scaffold only — add HTTP client / export parser for this state.")
        return []
