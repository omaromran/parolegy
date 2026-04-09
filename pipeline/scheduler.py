"""Run `main.py` on a daily schedule. Intended for a long-lived process or systemd timer."""

from __future__ import annotations

import os
import subprocess
import sys
import time
from pathlib import Path

import schedule

ROOT = Path(__file__).resolve().parent
MAIN = ROOT / "main.py"


def job() -> None:
    subprocess.run([sys.executable, str(MAIN)], cwd=str(ROOT), check=False)


def main() -> None:
    run_at = os.environ.get("PIPELINE_DAILY_TIME", "02:00")
    schedule.every().day.at(run_at).do(job)
    print(f"Scheduled daily pipeline at {run_at} (set PIPELINE_DAILY_TIME to change).", flush=True)
    while True:
        schedule.run_pending()
        time.sleep(30)


if __name__ == "__main__":
    main()
