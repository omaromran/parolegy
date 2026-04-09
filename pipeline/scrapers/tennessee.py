"""Scaffold — TN Department of Corrections public roster (not implemented)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class TennesseeScraper(BaseScraper):
    source_state = "TN"
    source_url = "https://www.google.com/search?q=TN+department+of+corrections+inmate+search"

    def run(self) -> list[dict]:
        logger.warning("TN: scaffold only — add HTTP client / export parser for this state.")
        return []
