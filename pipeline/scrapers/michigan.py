"""Scaffold — MI Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class MichiganScraper(BaseScraper):
    source_state = "MI"
    source_url = "https://www.google.com/search?q=MI+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("MI: scaffold only — add HTTP client / export parser for this state.")
        return []
