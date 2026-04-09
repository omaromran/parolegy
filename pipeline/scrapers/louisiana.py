"""Scaffold — LA Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class LouisianaScraper(BaseScraper):
    source_state = "LA"
    source_url = "https://www.google.com/search?q=LA+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("LA: scaffold only — add HTTP client / export parser for this state.")
        return []
