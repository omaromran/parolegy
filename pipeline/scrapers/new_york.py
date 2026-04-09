"""New York DOCCS public inmate lookup — typically session-based search."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class NewYorkScraper(BaseScraper):
    source_state = "NY"
    source_url = "https://doccs.ny.gov/location-inmate-lookup"

    def run(self) -> list[dict]:
        logger.warning("New York: implement DOCCS lookup or authorized bulk source.")
        return []
