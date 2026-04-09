"""Scaffold — MA Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class MassachusettsScraper(BaseScraper):
    source_state = "MA"
    source_url = "https://www.google.com/search?q=MA+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("MA: scaffold only — add HTTP client / export parser for this state.")
        return []
