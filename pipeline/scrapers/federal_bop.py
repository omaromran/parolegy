from __future__ import annotations

import logging
import os
from typing import Any

import httpx

from .base import BaseScraper

logger = logging.getLogger(__name__)

BOP_URL = "https://www.bop.gov/PublicInfo/execute/inmateloc"

# First letters A–Z paired with common surnames — BOP requires both first and last name fields.
DEFAULT_SURNAMES = (
    "Smith Johnson Williams Brown Jones Garcia Miller Davis Rodriguez Martinez "
    "Hernandez Lopez Gonzalez Wilson Anderson Thomas Taylor Moore Jackson Martin Lee Perez Thompson White Harris Sanchez Clark Ramirez Lewis Robinson Walker Young Allen King Wright Scott Torres Nguyen Hill Flores Green Adams Nelson Baker Hall Rivera Campbell Mitchell Carter Roberts"
).split()


class FederalBopScraper(BaseScraper):
    source_state = "FBOP"
    source_url = "https://www.bop.gov/inmateloc/"

    def run(self) -> list[dict[str, Any]]:
        letters = os.environ.get("BOP_FIRST_LETTERS", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        surnames_raw = os.environ.get("BOP_SURNAMES", "").strip()
        surnames = surnames_raw.split() if surnames_raw else list(DEFAULT_SURNAMES)
        max_queries = int(os.environ.get("BOP_MAX_QUERIES", "400"))
        max_results = int(os.environ.get("BOP_MAX_RESULTS_TOTAL", "25000"))

        seen: set[str] = set()
        out: list[dict[str, Any]] = []
        queries = 0
        for last in surnames:
            for fl in letters:
                if queries >= max_queries:
                    break
                if len(out) >= max_results:
                    break
                params = {
                    "todo": "query",
                    "output": "json",
                    "nameFirst": fl,
                    "nameLast": last,
                    "race": "",
                    "age": "",
                    "sex": "",
                }
                self._jitter_delay()
                r = self.client().get(
                    BOP_URL,
                    params=params,
                    timeout=60,
                    headers={
                        "Referer": "https://www.bop.gov/inmateloc/",
                        "Accept": "application/json, text/plain, */*",
                    },
                )
                r.raise_for_status()
                data = r.json()
                if data.get("Exceptions") or data.get("Captcha"):
                    logger.warning("BOP query issue: %s", data)
                    queries += 1
                    continue
                block = data.get("InmateLocator") or []
                for row in block:
                    num = str(row.get("inmateNum") or "").strip()
                    if not num or num in seen:
                        continue
                    seen.add(num)
                    fn = (row.get("nameFirst") or "").strip()
                    mn = (row.get("nameMiddle") or "").strip()
                    ln = (row.get("nameLast") or "").strip()
                    parts = [p for p in (fn, mn, ln) if p]
                    full_name = " ".join(parts)
                    fac_name = (row.get("faclName") or "").strip()
                    fac_code = (row.get("faclCode") or "").strip()
                    fac = f"{fac_name} ({fac_code})".strip() if fac_code else fac_name
                    pr = (row.get("projRelDate") or row.get("actRelDate") or "").strip()
                    out.append(
                        self.raw_record(
                            full_name=full_name,
                            first_name=fn,
                            last_name=ln,
                            inmate_id=num,
                            facility=fac,
                            offense="",
                            sentence_start_date="",
                            projected_release_date=pr,
                            source_url=self.source_url,
                        )
                    )
                queries += 1
            if queries >= max_queries or len(out) >= max_results:
                break

        logger.info("Federal BOP: %s unique rows after %s queries", len(out), queries)
        return out
