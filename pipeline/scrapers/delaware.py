"""Scaffold — DE Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class DelawareScraper(BaseScraper):
    source_state = "DE"
    source_url = "https://www.google.com/search?q=DE+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("DE: scaffold only — add HTTP client / export parser for this state.")
        return []
