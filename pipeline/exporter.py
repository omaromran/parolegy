from __future__ import annotations

import csv
import json
import logging
import os
from datetime import date
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

MAIL_COLUMNS = [
    "full_name",
    "facility",
    "facility_address",
    "city",
    "state",
    "zip_code",
    "inmate_id",
    "source_state",
    "projected_release_date",
    "offense",
]


def _out_dir() -> Path:
    root = Path(__file__).resolve().parent
    return Path(os.environ.get("PIPELINE_OUTPUT_DIR", root / "output"))


def _public_mirror_dir() -> Path | None:
    raw = os.environ.get("PIPELINE_PUBLIC_MIRROR_DIR", "").strip()
    if raw:
        return Path(raw)
    repo = Path(__file__).resolve().parent.parent
    p = repo / "public" / "data" / "roster"
    return p


def export_day(
    all_records: list[dict[str, Any]],
    new_only: list[dict[str, Any]],
    day: date | None = None,
) -> dict[str, str]:
    d = day or date.today()
    ds = d.isoformat()
    out = _out_dir()
    out.mkdir(parents=True, exist_ok=True)

    def strip_meta(r: dict[str, Any]) -> dict[str, Any]:
        return {k: v for k, v in r.items() if k not in ("is_new_today",)}

    full_clean = [strip_meta(r) for r in all_records]
    new_clean = [strip_meta(r) for r in new_only]

    json_full = out / f"daily_roster_{ds}.json"
    json_new = out / f"new_today_{ds}.json"
    csv_full = out / f"daily_roster_{ds}.csv"
    csv_new = out / f"new_today_{ds}.csv"

    with open(json_full, "w", encoding="utf-8") as f:
        json.dump(full_clean, f, indent=0)

    with open(json_new, "w", encoding="utf-8") as f:
        json.dump(new_clean, f, indent=0)

    def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
        with open(path, "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=MAIL_COLUMNS, extrasaction="ignore")
            w.writeheader()
            for r in rows:
                w.writerow({c: r.get(c, "") for c in MAIL_COLUMNS})

    write_csv(csv_full, full_clean)
    write_csv(csv_new, new_clean)

    latest = {
        "date": ds,
        "daily_roster_json": str(json_full),
        "daily_roster_csv": str(csv_full),
        "new_today_json": str(json_new),
        "new_today_csv": str(csv_new),
        "counts": {
            "daily_total": len(full_clean),
            "new_today": len(new_clean),
        },
    }
    summary_path = out / f"summary_{ds}.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(latest, f, indent=0)

    mirror = _public_mirror_dir()
    paths: dict[str, str] = {
        "summary": str(summary_path),
        "daily_roster_json": str(json_full),
        "daily_roster_csv": str(csv_full),
        "new_today_json": str(json_new),
        "new_today_csv": str(csv_new),
    }

    if mirror:
        mirror.mkdir(parents=True, exist_ok=True)
        for name, path in [
            ("latest_summary.json", summary_path),
            (f"daily_roster_{ds}.json", json_full),
            (f"daily_roster_{ds}.csv", csv_full),
            (f"new_today_{ds}.json", json_new),
            (f"new_today_{ds}.csv", csv_new),
        ]:
            dest = mirror / name
            dest.write_bytes(Path(path).read_bytes())
        paths["public_mirror"] = str(mirror)

    logger.info("Exported %s rows (new today: %s)", len(full_clean), len(new_clean))
    return paths
