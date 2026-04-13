# Incarcerated population database (pipeline)

Daily (or on-demand) job that pulls public Department of Corrections rosters, normalizes rows to a single schema, deduplicates against a local registry, and exports CSV/JSON for mail merge and the Parolegy admin **Incarcerated population database** page (`/admin/roster`).

## Quick start

```bash
cd pipeline
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# One or more states (recommended for development)
python3 main.py --state TX --dry-run
python3 main.py --state TX,GA --dry-run
python3 main.py --state TX --state GA

# Full country run (will fail until all scrapers are implemented)
python3 main.py
```

## Outputs

| File | Purpose |
|------|---------|
| `output/daily_roster_YYYY-MM-DD.json` | Full normalized roster |
| `output/daily_roster_YYYY-MM-DD.csv` | Mail-merge columns for full roster |
| `output/new_today_YYYY-MM-DD.*` | First-seen-today inmates only |
| `output/summary_YYYY-MM-DD.json` | Paths and counts |
| `output/pipeline_run_YYYY-MM-DD.json` | Per-state counts, failures, dedupe stats |
| `public/data/roster/` (repo root) | Mirror of the same files for Next.js static access |

## Implemented sources

- **TX** — Texas Open Data Portal (Socrata) “High Value Dataset” current population; dataset id is auto-discovered or set with `TEXAS_SOCRATA_DATASET_ID`.
- **NC** — `INMT4AA1.zip` inmate profile fixed-width file (large download; cached under `cache/`). Override with `NC_LOCAL_DAT_PATH` to point at an extracted `INMT4AA1.dat`. Limit rows with `NC_MAX_LINES` for tests.
- **FBOP** — BOP inmate locator JSON (`/PublicInfo/execute/inmateloc`). Grid search over surnames × first-letter; tune with `BOP_SURNAMES`, `BOP_FIRST_LETTERS`, `BOP_MAX_QUERIES`. The API may respond with `Captcha: true` for some IPs or high volume; results can be partial until you add cookies/proxy automation or reduce `BOP_MAX_QUERIES`.
- **GA** — Georgia GDC public offender query (`OffQryForm.jsp`). Searches by last name with pagination (45 rows per page max). The site keeps a pagination session; the scraper **reloads the disclaimer and accepts again before each new surname** so the next search is not empty. Coverage is surname-driven, not a single full-state dump: widen with `GA_SURNAMES` (comma or space separated) or raise `GA_MAX_SURNAMES` (default 25 common surnames from the FBOP list). Caps: `GA_MAX_PAGES_PER_SURNAME` (default 50), `GA_MAX_ROWS_TOTAL` (default 50000), `GA_RECORDS_PER_PAGE` (must be one of 9, 18, 27, 36, 45). Pagination sometimes returns HTTP 500; tune `GA_NEXT_PAGE_RETRIES` (default 3) and `GA_RETRY_BACKOFF_SEC` (default 2). **Projected release** is empty for GA rows: the result list HTML does not include release dates (only the per-offender detail view does).

Other priority states (FL, CA, NY, OH, PA, AZ) ship as **stubs** returning zero rows until you add HTTP/Playwright logic.

## Adding a new state scraper

1. Copy `scrapers/alabama.py` (or `scrapers/texas.py` for a full example) to match your naming convention.
2. Set `source_state` to the two-letter code (use `FBOP` for Federal Bureau of Prisons).
3. Set `source_url` to the canonical public page you scrape.
4. Implement `run()` → return `list[dict]` using `self.raw_record(...)` from `BaseScraper`.
5. Register the class in `scrapers/__init__.py` inside `SCRAPERS` (alphabetical imports are already generated).
6. Add facility mailing lines to `facility_addresses.json` under the state key. Use `_DEFAULT` for a fallback address when unit codes are unknown.

`BaseScraper` provides retries, jittered delays, and a shared `httpx` client (`self.client()`).

## Normalization & mail fields

`normalizer.py` splits names, normalizes dates to `YYYY-MM-DD`, fills `facility_address` / `city` / `zip_code` from `facility_addresses.json`, and logs how many rows still lack critical mailing fields.

## Deduplication

`data/inmate_registry.json` stores `first_seen_date` / `last_seen_date` per `source_state + inmate_id`. Delete this file to reset history (not recommended in production without backup).

## Scheduler

```bash
export PIPELINE_DAILY_TIME=02:15
python3 scheduler.py
```

Runs `main.py` once per day in a long-lived process. For production, prefer **cron** or **systemd timer** calling `python3 main.py` from `pipeline/`.

## Environment variables

| Variable | Meaning |
|----------|---------|
| `PIPELINE_HTTP_TIMEOUT` | HTTP timeout seconds (default `60`) |
| `PIPELINE_MIN_DELAY_SEC` / `PIPELINE_MAX_DELAY_SEC` | Jitter between requests |
| `PIPELINE_USER_AGENT` | User-Agent for outbound HTTP |
| `PIPELINE_OUTPUT_DIR` | Override output directory |
| `PIPELINE_PUBLIC_MIRROR_DIR` | Override Next.js mirror dir (default `../public/data/roster`) |
| `PIPELINE_REGISTRY_PATH` | Dedupe JSON path |
| `FACILITY_ADDRESSES_PATH` | Override facility JSON path |

See scraper files for state-specific variables (`TEXAS_*`, `NC_*`, `BOP_*`, `GA_*`, etc.).

## Integration with the Parolegy admin dashboard

After a successful run, files appear under `public/data/roster/` so the app can serve them as static assets. The admin **Incarcerated population database** page (`/admin/roster`) lists available exports and download links via `/api/admin/roster`.
