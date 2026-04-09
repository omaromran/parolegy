"""Scaffold — ME Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class MaineScraper(BaseScraper):
    source_state = "ME"
    source_url = "https://www.google.com/search?q=ME+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("ME: scaffold only — add HTTP client / export parser for this state.")
        return []
