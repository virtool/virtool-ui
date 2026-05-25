# Dropped fields

Fields that exist on legacy Mongo documents but are intentionally **not modelled** in the new Mongoose schemas.

Because every parent schema uses `strict: false`, dropped values still round-trip on read and write — they just don't appear in `InferSchemaType` and we won't write them from new code. If a dropped field needs to come back (e.g. a new feature reads it), add it to the schema and remove the row here.

## Why drop a field

- It was always written but never read.
- It is computed at read time by the data layer and the stored value is ignored.
- It duplicates state that lives elsewhere (Postgres, another collection).

Don't drop a field just because it's optional or rarely set — that's what the schema's optionality is for.

## Dropped

| Collection | Field | Reason | Dropped on |
| --- | --- | --- | --- |
| `references` | `internal_control` | Stored as `null` or `{id}` but the API value is always re-derived at read time by `get_internal_control` joining to `mongo.otus`. New code reads through the data layer, so the stored value is dead. | 2026-04-29 |
| `references` | `groups[].legacy_id` | Stored on some legacy entries (`"cleansed"`, hex string) but `get_reference_groups` always recomputes it from Postgres `groups.legacy_id` at read time. The stored value is ignored and goes away once the group-id backfill is run. | 2026-04-29 |
| `references` | `space` | Multi-tenancy hook with inconsistent shape (`{id: int}` vs bare `int`) and no current product use — every prod doc has `id: 0`. Will be reintroduced cleanly when spaces actually ship. | 2026-04-29 |
| `otus` | `imported` | Boolean flag set to `true` by all three import paths (`references/db.insert_joined_otu`, `references/alot.prepare_otu_insertion`, and the second clone insert in `references/db.py:1024`). Never read anywhere — provenance is now derived from `remote.id` instead. | 2026-04-29 |
| `otus` | `issues` | Verification cache written by import paths (`null` if clean, otherwise an `{empty_otu, empty_isolate, ...}` dict). The data layer always recomputes it via `verify(joined)` in `format_otu` (the `issues=False` default forces recompute). The stored value is always `null` in prod and never read. | 2026-04-29 |
| `otus` | `taxid` | Legacy NCBI taxonomy id, not referenced by any current Python module (`otus/`, `references/`, `indexes/`, `analyses/`). Only blast result handling reads `taxid` and that's from a different document shape. Will be reintroduced if/when taxonomy ships as a real feature. | 2026-04-29 |
