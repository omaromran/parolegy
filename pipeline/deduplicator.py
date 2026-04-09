from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


def _data_path() -> Path:
    root = Path(__file__).resolve().parent
    return Path(os.environ.get("PIPELINE_REGISTRY_PATH", root / "data" / "inmate_registry.json"))


@dataclass
class DedupeResult:
    records_with_meta: list[dict[str, Any]]
    new_keys: list[str]
    stats: dict[str, Any]


def _today_iso() -> str:
    return date.today().isoformat()


def load_registry(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"version": 1, "inmates": {}}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_registry(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=0, sort_keys=True)
    tmp.replace(path)


def stable_key(rec: dict[str, Any]) -> str:
    return f"{rec['source_state']}:{rec['inmate_id']}"


def apply_dedupe(records: list[dict[str, Any]]) -> DedupeResult:
    path = _data_path()
    reg = load_registry(path)
    inmates: dict[str, Any] = reg.setdefault("inmates", {})
    today = _today_iso()
    now = datetime.now(timezone.utc).isoformat()
    new_keys: set[str] = []
    enriched: list[dict[str, Any]] = []

    for rec in records:
        key = stable_key(rec)
        prev = inmates.get(key)
        if prev:
            first_seen = prev.get("first_seen_date", today)
            inmates[key] = {
                **prev,
                "last_seen_date": today,
                "last_seen_at": now,
            }
            is_new_today = False
        else:
            first_seen = today
            inmates[key] = {
                "first_seen_date": today,
                "last_seen_date": today,
                "first_seen_at": now,
                "last_seen_at": now,
            }
            new_keys.append(key)
            is_new_today = True

        row = {
            **rec,
            "first_seen_date": first_seen,
            "last_seen_date": inmates[key]["last_seen_date"],
            "is_new_today": is_new_today,
        }
        enriched.append(row)

    save_registry(path, reg)
    stats = {
        "registry_path": str(path),
        "total_tracked": len(inmates),
        "new_keys_today": len(new_keys),
    }
    logger.info("Dedupe: %s new keys of %s incoming rows", len(new_keys), len(records))
    return DedupeResult(records_with_meta=enriched, new_keys=set(new_keys), stats=stats)
