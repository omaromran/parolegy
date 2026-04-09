"""Scaffold — MT Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class MontanaScraper(BaseScraper):
    source_state = "MT"
    source_url = "https://www.google.com/search?q=MT+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("MT: scaffold only — add HTTP client / export parser for this state.")
        return []
