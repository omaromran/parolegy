"""Arizona ADC inmate data search."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class ArizonaScraper(BaseScraper):
    source_state = "AZ"
    source_url = "https://corrections.az.gov/inmate-data-search"

    def run(self) -> list[dict]:
        logger.warning("Arizona: implement ADC inmate search / published data endpoint.")
        return []
