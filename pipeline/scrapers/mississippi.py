"""Scaffold — MS Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class MississippiScraper(BaseScraper):
    source_state = "MS"
    source_url = "https://www.google.com/search?q=MS+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("MS: scaffold only — add HTTP client / export parser for this state.")
        return []
