from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

_ROOT = Path(__file__).resolve().parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from deduplicator import apply_dedupe
from exporter import export_day
from normalizer import normalize_records

from scrapers import SCRAPERS
from scrapers.base import BaseScraper, ScraperFailure

LOG_DIR = Path(__file__).resolve().parent / "logs"


def setup_logging() -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_path = LOG_DIR / f"pipeline_{date.today().isoformat()}.log"
    level = getattr(logging, os.environ.get("PIPELINE_LOG_LEVEL", "INFO").upper(), logging.INFO)
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        handlers=[logging.StreamHandler(sys.stdout), logging.FileHandler(log_path, encoding="utf-8")],
    )


def _parse_state_codes(raw: list[str] | None) -> list[str]:
    """Expand --state flags into ordered unique codes (supports comma-separated, e.g. TX,GA)."""
    if not raw:
        return list(SCRAPERS.keys())
    out: list[str] = []
    for chunk in raw:
        for part in chunk.replace(",", " ").split():
            p = part.strip().upper()
            if p:
                out.append(p)
    seen: set[str] = set()
    uniq: list[str] = []
    for c in out:
        if c not in seen:
            seen.add(c)
            uniq.append(c)
    return uniq


def run_scraper(code: str, cls: type[BaseScraper]) -> tuple[list[dict[str, Any]], str | None]:
    logger = logging.getLogger("pipeline")
    try:
        with cls() as scraper:
            rows = scraper.run()
        if not rows:
            msg = "zero rows (treated as failure)"
            logger.error("%s: %s", code, msg)
            return [], msg
        return rows, None
    except ScraperFailure as e:
        logger.error("%s: scraper failure: %s", code, e)
        return [], str(e)
    except Exception as e:
        logger.exception("%s: unexpected error: %s", code, e)
        return [], str(e)


def main() -> int:
    setup_logging()
    logger = logging.getLogger("pipeline")
    parser = argparse.ArgumentParser(description="DOC roster ingestion pipeline")
    parser.add_argument(
        "--state",
        action="append",
        default=None,
        metavar="CODE",
        help="Jurisdiction(s) to run: repeat (--state TX --state GA) or comma-separated (--state TX,GA). "
        "Omit to run every code in the registry (stubs will fail as zero-row).",
    )
    parser.add_argument("--dry-run", action="store_true", help="Fetch and log counts only; skip export and registry update")
    args = parser.parse_args()

    codes = _parse_state_codes(args.state)
    for c in codes:
        if c not in SCRAPERS:
            logger.error("Unknown state code: %s", c)
            return 2

    scraped_at = datetime.now(timezone.utc).isoformat()
    all_raw: list[dict[str, Any]] = []
    failures: dict[str, str] = {}
    per_state_counts: dict[str, int] = {}

    for code in codes:
        cls = SCRAPERS[code]
        rows, err = run_scraper(code, cls)
        if err:
            failures[code] = err
            per_state_counts[code] = 0
            continue
        per_state_counts[code] = len(rows)
        all_raw.extend(rows)

    normalized = normalize_records(all_raw, scraped_at=scraped_at)

    if args.dry_run:
        summary = {
            "scraped_at": scraped_at,
            "per_state_counts": per_state_counts,
            "failures": failures,
            "total_normalized": len(normalized),
        }
        print(json.dumps(summary, indent=2))
        return 0 if not failures else 1

    deduped = apply_dedupe(normalized)
    new_today = [r for r in deduped.records_with_meta if r.get("is_new_today")]
    paths = export_day(deduped.records_with_meta, new_today)

    summary = {
        "scraped_at": scraped_at,
        "per_state_counts": per_state_counts,
        "new_records_today": len(new_today),
        "failures": failures,
        "output": paths,
        "dedupe": deduped.stats,
    }
    summary_path = Path(paths["summary"]).parent / f"pipeline_run_{date.today().isoformat()}.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    logger.info("Summary written to %s — %s", summary_path, json.dumps(summary, default=str))
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
