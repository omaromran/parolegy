"""Scaffold — NV Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class NevadaScraper(BaseScraper):
    source_state = "NV"
    source_url = "https://www.google.com/search?q=NV+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("NV: scaffold only — add HTTP client / export parser for this state.")
        return []
