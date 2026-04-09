"""Scaffold — OR Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class OregonScraper(BaseScraper):
    source_state = "OR"
    source_url = "https://www.google.com/search?q=OR+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("OR: scaffold only — add HTTP client / export parser for this state.")
        return []
