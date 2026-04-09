"""Scaffold — CO Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class ColoradoScraper(BaseScraper):
    source_state = "CO"
    source_url = "https://www.google.com/search?q=CO+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("CO: scaffold only — add HTTP client / export parser for this state.")
        return []
