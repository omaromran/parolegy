"""Scaffold — IN Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class IndianaScraper(BaseScraper):
    source_state = "IN"
    source_url = "https://www.google.com/search?q=IN+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("IN: scaffold only — add HTTP client / export parser for this state.")
        return []
