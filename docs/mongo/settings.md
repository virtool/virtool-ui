# settings

Application-wide configuration. A single document with `_id: "settings"` storing instance-level toggles and defaults read at runtime by the API and workflows.

## Source

- Python module: `virtool/settings/{data,models,oas,api}.py`
- Pydantic models: `virtool/settings/models.py` (`Settings`), `virtool/settings/oas.py` (`UpdateSettingsRequest`)
- Live schema sample: 1 document from production (Compass-generated JSON Schema, supplied during port).

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | Always the literal `"settings"`. The collection holds exactly one document. |
| `default_source_types` | `string[]` | yes | Seed value copied into `references.source_types` on reference creation (`virtool/references/db.py`). Default `["isolate", "strain"]`. |
| `enable_api` | `boolean` | yes | Master switch for the public HTTP API. |
| `enable_sentry` | `boolean` | yes | Whether to forward exceptions to Sentry. |
| `hmm_slug` | `string` | yes | GitHub-style `<owner>/<repo>` slug for the HMM data release source. Default `"virtool/virtool-hmm"`. |
| `minimum_password_length` | `int` | yes | Enforced by user-create / change-password flows. Default `8`. |
| `sample_all_read` | `boolean` | yes | World-readable default for newly created samples. |
| `sample_all_write` | `boolean` | yes | World-writable default for newly created samples. |
| `sample_group` | `string` | yes | Sample group-assignment policy. Known values: `"none"`, `"force_choice"`, `"users_primary_group"` (see `virtool/samples/data.py`). |
| `sample_group_read` | `boolean` | yes | Group-readable default for newly created samples. |
| `sample_group_write` | `boolean` | yes | Group-writable default for newly created samples. |
| `sample_unique_names` | `boolean` | yes | Enforce sample-name uniqueness within an instance. |
| `software_channel` | `string` | yes | Release channel used by the software-update checker. Known values: `"stable"`, `"beta"`, `"alpha"`. **Not present in `Settings`/`UpdateSettingsRequest` Pydantic models** — written by deployment/release tooling rather than the API. |

## Authoritative side

Mongo-only. No Postgres counterpart.

## Quirks captured from Python

- The data layer (`virtool/settings/data.py`) reads with `find_one({"_id": "settings"}, projection={"_id": False})` and falls back to a default `Settings()` when the document is missing. The new app should mirror that — never crash on a missing settings doc.
- `ensure()` upserts a document by merging Pydantic defaults under any existing values. There is no migration-managed schema; whatever fields the running version of `Settings` declares get written back. This is how new fields get backfilled.
- `update()` uses `find_one_and_update` with `$set` of only the keys the request provided (`exclude_unset=True`). Other fields are preserved.
- `software_channel` lives in the document but is not surfaced through the settings API. Keep `strict: false` so it round-trips even though the Mongoose schema doesn't materially use it; treat it as read-only from the app's perspective.
- The Pydantic `Settings` model types `sample_group` as `int | str | None`, but the live data is always a string and `UpdateSettingsRequest` only accepts `str | None`. Modelled here as required `String` to match production. If a `null` legacy value ever surfaces, `strict: false` will keep it round-tripping.
- Indexes: none beyond the implicit `_id`.

## Mongoose schema

`apps/web/src/server/db/mongo/settings.ts`. Uses `strict: false` so unknown legacy fields and `software_channel` round-trip safely, and explicit `collection: 'settings'` to match the live name.

Inferred type: `SettingsDoc` (`InferSchemaType<typeof settingsSchema>`).

## Open follow-ups

- Decide whether `software_channel` should become a first-class settings field (with API support) or keep being deploy-managed. Out of scope for the port.
- `sample_group` is effectively an enum — tighten to a union once we're confident no legacy `null`/numeric values exist in any deployment.
- Consider modelling the singleton constraint at the data-access layer (always query/upsert `_id: "settings"`) rather than in the schema.
