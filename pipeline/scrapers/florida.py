"""Florida FDLE / DOC public search — implement form/session handling (often ASP.NET VIEWSTATE)."""

from __future__ import annotations

import logging

from .base import BaseScraper

logger = logging.getLogger(__name__)


class FloridaScraper(BaseScraper):
    source_state = "FL"
    source_url = "https://www.fdle.state.fl.us/CJAB/OffenderSearch/OffenderSearch.aspx"

    def run(self) -> list[dict]:
        logger.warning("Florida: implement FDLE offender search (ASP.NET) or official bulk export.")
        return []
