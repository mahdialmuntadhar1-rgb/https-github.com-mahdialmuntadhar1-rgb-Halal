# rafid-db freeze (B7)

**Database:** Cloudflare D1 `rafid-db`  
**ID:** `30febf83-135b-4888-8e5a-461105bb590a`  
**HALAL Worker:** `halal-api-real`  
**Also referenced by:** StudentHUB Plus (`rafid-api` / `wrangler.api.toml`)

## Freeze

HALAL must **never** blindly run StudentHUB migrations against this D1.

StudentHUB tables (examples: `hero_images`, `opportunities`, `user_blocks`, `api_rate_limits`) live in the **same** SQLite database as HALAL `halal_*` tables.

## Allowed HALAL database changes

- Additive `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` only
- HALAL-owned `halal_*` objects
- Reuse of an **already-existing** shared table only after inspecting columns (see `0004_api_rate_limits.sql`)

## Forbidden

- `DROP TABLE` / `DROP INDEX` on shared or unknown objects
- Running files from `https-github.com-mahdialmuntadhar1-rgb-studentHUB-plus/migrations/`
- Creating a replacement D1 database
- Pointing HALAL at a new `database_id`

## Rate-limit table

Inspected on 2026-08-15: `api_rate_limits` **already exists** on rafid-db with:

- PK `key`, required `bucket`, `ip_hash`, `window_start`, `count`
- later-added nullable `id`, `rate_key`, `route_group`

`0004_api_rate_limits.sql` was **not applied**. HALAL writes into the existing columns. Do not DROP this table.
