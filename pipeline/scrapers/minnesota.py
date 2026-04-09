"""Scaffold — MN Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class MinnesotaScraper(BaseScraper):
    source_state = "MN"
    source_url = "https://www.google.com/search?q=MN+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("MN: scaffold only — add HTTP client / export parser for this state.")
        return []
