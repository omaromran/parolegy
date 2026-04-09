from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Any

from dateutil import parser as date_parser

logger = logging.getLogger(__name__)

DATE_ONLY = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _pipeline_root() -> Path:
    return Path(__file__).resolve().parent


def load_facility_addresses() -> dict[str, Any]:
    path = Path(os.environ.get("FACILITY_ADDRESSES_PATH", _pipeline_root() / "facility_addresses.json"))
    if not path.exists():
        logger.warning("facility_addresses.json not found at %s — mailing fields may be empty", path)
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def split_full_name(full_name: str) -> tuple[str, str]:
    full_name = " ".join(full_name.replace(",", " ").split()).strip()
    if not full_name:
        return "", ""
    parts = full_name.split()
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def normalize_date(value: str | None) -> str:
    if value is None:
        return ""
    s = str(value).strip()
    if not s or s.lower() in ("none", "null", "n/a", "unavailable at this time.", "unavailable"):
        return ""
    if DATE_ONLY.match(s):
        return s
    try:
        dt = date_parser.parse(s, fuzzy=False)
        if dt.tzinfo:
            dt = dt.replace(tzinfo=None)
        return dt.strftime("%Y-%m-%d")
    except (ValueError, TypeError, OverflowError):
        return ""


def apply_facility_lookup(
    source_state: str,
    facility: str,
    addresses: dict[str, Any],
) -> tuple[str, str, str, str]:
    st = source_state.upper()
    fac = (facility or "").strip().upper()
    by_state = addresses.get(st, {})
    if not fac:
        return "", "", "", ""
    # Exact key match first
    for key, addr in by_state.items():
        if key.upper() == fac:
            return (
                addr.get("address", ""),
                addr.get("city", ""),
                addr.get("state", st),
                addr.get("zip", ""),
            )
    # Substring match on facility name
    for key, addr in by_state.items():
        if key.startswith("_"):
            continue
        if key.upper() in fac or fac in key.upper():
            return (
                addr.get("address", ""),
                addr.get("city", ""),
                addr.get("state", st),
                addr.get("zip", ""),
            )
    default = by_state.get("_DEFAULT")
    if isinstance(default, dict) and default.get("address"):
        return (
            default.get("address", ""),
            default.get("city", ""),
            default.get("state", st),
            default.get("zip", ""),
        )
    return "", "", "", ""


def normalize_records(raw: list[dict[str, Any]], scraped_at: str) -> list[dict[str, Any]]:
    addresses = load_facility_addresses()
    out: list[dict[str, Any]] = []
    missing_mail_count = 0
    for row in raw:
        full_name = (row.get("full_name") or "").strip()
        fn = (row.get("first_name") or "").strip()
        ln = (row.get("last_name") or "").strip()
        if full_name and (not fn or not ln):
            fn2, ln2 = split_full_name(full_name.replace(",", ", "))
            fn = fn or fn2
            ln = ln or ln2
        if not full_name and fn and ln:
            full_name = f"{fn} {ln}".strip()

        source_state = (row.get("source_state") or "").strip().upper()
        facility = (row.get("facility") or "").strip()
        faddr, city, st, z = apply_facility_lookup(source_state, facility, addresses)
        facility_address = (row.get("facility_address") or "").strip() or faddr
        city = (row.get("city") or "").strip() or city
        st = (row.get("state") or "").strip() or st
        z = (row.get("zip_code") or "").strip() or z

        rec = {
            "full_name": full_name,
            "first_name": fn,
            "last_name": ln,
            "inmate_id": str(row.get("inmate_id") or "").strip(),
            "facility": facility,
            "facility_address": facility_address,
            "city": city,
            "state": (st or source_state or "").strip(),
            "zip_code": z,
            "offense": (row.get("offense") or "").strip(),
            "sentence_start_date": normalize_date(row.get("sentence_start_date")),
            "projected_release_date": normalize_date(row.get("projected_release_date")),
            "source_state": source_state,
            "source_url": (row.get("source_url") or "").strip(),
            "scraped_at": scraped_at,
        }
        missing = []
        if not rec["full_name"]:
            missing.append("full_name")
        if not rec["inmate_id"]:
            missing.append("inmate_id")
        if not rec["facility_address"] or not rec["zip_code"]:
            missing.extend([x for x in ["facility_address", "zip_code"] if not rec[x]])
        if missing:
            missing_mail_count += 1
        out.append(rec)
    if missing_mail_count:
        logger.warning(
            "%s records missing full_name or inmate_id or mailing address fields after lookup",
            missing_mail_count,
        )
    return out
