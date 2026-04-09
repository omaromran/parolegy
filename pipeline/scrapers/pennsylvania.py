"""Pennsylvania — Angular inmate locator; reverse-engineer XHR or use browser automation."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class PennsylvaniaScraper(BaseScraper):
    source_state = "PA"
    source_url = "https://inmatelocator.cor.pa.gov/"

    def run(self) -> list[dict]:
        logger.warning("Pennsylvania: implement COR locator API or Playwright against inmatelocator.cor.pa.gov.")
        return []
