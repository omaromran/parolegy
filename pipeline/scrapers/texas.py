from __future__ import annotations

import logging
import os
from typing import Any

import httpx

from .base import BaseScraper, ScraperFailure

logger = logging.getLogger(__name__)

SOCRATA_CATALOG = "https://api.us.socrata.com/api/catalog/v1"
TEXAS_DOMAIN = "data.texas.gov"


def _discover_tdcj_dataset_id(client: httpx.Client) -> str:
    override = os.environ.get("TEXAS_SOCRATA_DATASET_ID", "").strip()
    if override:
        return override

    q = "High Value Dataset currently incarcerated"
    params = {"domains": TEXAS_DOMAIN, "q": q, "limit": 20, "only": "datasets"}
    r = client.get(SOCRATA_CATALOG, params=params, timeout=60)
    r.raise_for_status()
    data = r.json()
    results = data.get("results") or []
    candidates: list[tuple[str, str]] = []
    for item in results:
        res = item.get("resource") or {}
        rid = res.get("id")
        name = (res.get("name") or "").lower()
        desc = (res.get("description") or "").lower()
        if not rid:
            continue
        if "high value dataset" in name and "incarcerated" in desc:
            candidates.append((rid, res.get("updatedAt") or ""))
    if not candidates:
        raise ScraperFailure("Could not auto-discover Texas TDCJ High Value dataset; set TEXAS_SOCRATA_DATASET_ID")
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[0][0]


def _iter_socrata_rows(client: httpx.Client, dataset_id: str) -> list[dict[str, Any]]:
    base = f"https://{TEXAS_DOMAIN}/resource/{dataset_id}.json"
    page_size = int(os.environ.get("TEXAS_PAGE_SIZE", "50000"))
    offset = 0
    rows: list[dict[str, Any]] = []
    while True:
        params = {"$limit": page_size, "$offset": offset}
        r = client.get(base, params=params, timeout=120)
        r.raise_for_status()
        chunk = r.json()
        if not chunk:
            break
        rows.extend(chunk)
        if len(chunk) < page_size:
            break
        offset += page_size
    return rows


def _tx_release_display(r: dict[str, Any]) -> str:
    """Pick a useful release-related date; skip empty and common life/sentinel placeholders."""
    for key in (
        "next_parole_review_date",
        "parole_eligibility_date",
        "projected_release",
        "maximum_sentence_date",
    ):
        v = r.get(key)
        if v is None:
            continue
        s = str(v).strip()
        if not s or s.lower() in ("null", "none"):
            continue
        if any(tok in s for tok in ("7550", "9999", "9998")):
            continue
        return s
    return ""


class TexasScraper(BaseScraper):
    source_state = "TX"
    source_url = "https://data.texas.gov/browse?q=TDCJ+High+Value+Dataset"

    def run(self) -> list[dict[str, Any]]:
        with httpx.Client(
            timeout=120,
            headers={"User-Agent": self.client().headers.get("User-Agent", "")},
            follow_redirects=True,
        ) as hx:
            dataset_id = _discover_tdcj_dataset_id(hx)
            logger.info("Texas Socrata dataset id: %s", dataset_id)
            rows = _iter_socrata_rows(hx, dataset_id)
        out: list[dict[str, Any]] = []
        for r in rows:
            name_raw = (r.get("name") or "").strip()
            if not name_raw:
                continue
            if "," in name_raw:
                last, first = name_raw.split(",", 1)
                full_name = f"{first.strip()} {last.strip()}".strip()
                ln = last.strip()
                fn = first.strip().split()[0] if first.strip() else ""
            else:
                full_name = name_raw
                fn, ln = "", ""
            sid = str(r.get("sid_number") or "").strip()
            tdcj = str(r.get("tdcj_number") or "").strip()
            inmate_id = tdcj or sid
            fac = (r.get("current_facility") or "").strip()
            offense = (r.get("tdcj_offense") or r.get("offense_code") or "").strip()
            pr = _tx_release_display(r)
            sd = r.get("sentence_date") or ""
            out.append(
                self.raw_record(
                    full_name=full_name or name_raw,
                    first_name=fn,
                    last_name=ln,
                    inmate_id=inmate_id,
                    facility=fac,
                    offense=offense,
                    sentence_start_date=str(sd) if sd else "",
                    projected_release_date=pr,
                    source_url=f"https://{TEXAS_DOMAIN}/d/{dataset_id}",
                )
            )
        logger.info("Texas: fetched %s rows", len(out))
        return out
