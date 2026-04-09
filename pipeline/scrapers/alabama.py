"""Scaffold — AL Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class AlabamaScraper(BaseScraper):
    source_state = "AL"
    source_url = "https://www.google.com/search?q=AL+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("AL: scaffold only — add HTTP client / export parser for this state.")
        return []
