"""Ohio DRC offender search."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class OhioScraper(BaseScraper):
    source_state = "OH"
    source_url = "https://appgateway.drc.ohio.gov/OffenderSearch"

    def run(self) -> list[dict]:
        logger.warning("Ohio: implement DRC offender search client.")
        return []
