from __future__ import annotations

import io
import logging
import os
import zipfile
from pathlib import Path
from typing import Any

import httpx

from .base import BaseScraper, ScraperFailure

logger = logging.getLogger(__name__)

ZIP_URL = os.environ.get(
    "NC_INMT_ZIP_URL",
    "https://opus.doc.state.nc.us/offenders/INMT4AA1.zip",
)


def _cache_dir() -> Path:
    root = Path(__file__).resolve().parent.parent
    return Path(os.environ.get("NC_CACHE_DIR", root / "cache"))


def _download_zip(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    logger.info("Downloading NC INMT4AA1 zip (large) to %s", path)
    ua = os.environ.get(
        "PIPELINE_USER_AGENT",
        "Mozilla/5.0 (compatible; ParolegyPipeline/1.0; +https://parolegy.com)",
    )
    with httpx.stream("GET", ZIP_URL, follow_redirects=True, timeout=600, headers={"User-Agent": ua}) as r:
        r.raise_for_status()
        with open(path, "wb") as f:
            for chunk in r.iter_bytes(1024 * 1024):
                f.write(chunk)


def _ensure_zip() -> Path:
    cache = _cache_dir() / "INMT4AA1.zip"
    max_age = int(os.environ.get("NC_CACHE_MAX_AGE_HOURS", "24"))
    if cache.exists() and max_age > 0:
        import time

        age_h = (time.time() - cache.stat().st_mtime) / 3600
        if age_h < max_age:
            return cache
    _download_zip(cache)
    return cache


def _parse_line(line: str) -> dict[str, str] | None:
    """Fixed-width INMT4AA1.dat slices (1-based positions from NC .des file)."""
    if len(line) < 700:
        return None
    doc = line[0:7].strip()
    last = line[7:27].strip()
    first = line[27:38].strip()
    if not doc:
        return None
    adm = line[361:371].strip()
    facility = line[481:511].strip()
    offense = line[560:590].strip()
    max_rel = line[686:696].strip()
    return {
        "doc": doc,
        "first": first,
        "last": last,
        "admission": adm,
        "facility": facility,
        "offense": offense,
        "max_release": max_rel,
    }


class NorthCarolinaScraper(BaseScraper):
    source_state = "NC"
    source_url = "https://webapps.doc.state.nc.us/opi/downloads.do?method=view"

    def run(self) -> list[dict[str, Any]]:
        local_dat = os.environ.get("NC_LOCAL_DAT_PATH", "").strip()
        max_lines_env = os.environ.get("NC_MAX_LINES", "").strip()
        max_lines = int(max_lines_env) if max_lines_env else None

        if local_dat:
            path = Path(local_dat)
            if not path.exists():
                raise ScraperFailure(f"NC_LOCAL_DAT_PATH not found: {path}")
            fp = open(path, encoding="utf-8", errors="replace")
            zf = None
        else:
            zpath = _ensure_zip()
            zf = zipfile.ZipFile(zpath)
            fp = io.TextIOWrapper(zf.open("INMT4AA1.dat", "r"), encoding="utf-8", errors="replace")

        out: list[dict[str, Any]] = []
        try:
            for i, line in enumerate(fp):
                if max_lines is not None and i >= max_lines:
                    break
                line = line.rstrip("\n\r")
                p = _parse_line(line)
                if not p:
                    continue
                full_name = f"{p['first']} {p['last']}".strip()
                out.append(
                    self.raw_record(
                        full_name=full_name,
                        first_name=p["first"],
                        last_name=p["last"],
                        inmate_id=p["doc"],
                        facility=p["facility"],
                        offense=p["offense"],
                        sentence_start_date=p["admission"],
                        projected_release_date=p["max_release"],
                        source_url=self.source_url,
                    )
                )
        finally:
            fp.close()
            if zf:
                zf.close()

        logger.info("North Carolina: parsed %s rows", len(out))
        return out
