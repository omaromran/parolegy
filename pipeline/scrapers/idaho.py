"""Scaffold — ID Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class IdahoScraper(BaseScraper):
    source_state = "ID"
    source_url = "https://www.google.com/search?q=ID+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("ID: scaffold only — add HTTP client / export parser for this state.")
        return []
