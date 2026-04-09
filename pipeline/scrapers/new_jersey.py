"""Scaffold — NJ Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class NewJerseyScraper(BaseScraper):
    source_state = "NJ"
    source_url = "https://www.google.com/search?q=NJ+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("NJ: scaffold only — add HTTP client / export parser for this state.")
        return []
