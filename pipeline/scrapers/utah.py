"""Scaffold — UT Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class UtahScraper(BaseScraper):
    source_state = "UT"
    source_url = "https://www.google.com/search?q=UT+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("UT: scaffold only — add HTTP client / export parser for this state.")
        return []
