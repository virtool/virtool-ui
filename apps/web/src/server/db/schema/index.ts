// Drizzle table definitions are re-exported from this module. They describe
// existing tables whose schema is owned by the upstream Python service
// (Alembic + SQLAlchemy migrations) — Drizzle does not push migrations from
// here. Each feature owns a sibling file (e.g. `labels.ts`) and is added to
// the `export *` list as it lands.
export * from "./labels";
export * from "./sessions";
export * from "./users";
