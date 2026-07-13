// Bootstrap for the jobs integration suites. The real schema is owned by the
// upstream Python service via Alembic, so the DDL here is a hand-written mirror
// covering only the columns the Drizzle schemas under `../../db/schema`
// declare. Keep it in step with those files — if a column is added there, add
// it here too, or the suite will pass against a table the app can't actually
// read.

import type { AdministratorRoleName } from "@administration/types";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { takeFirstOrThrow } from "../../db/rows";
import * as schema from "../../db/schema";
import { jobs } from "../../db/schema/jobs";
import { users } from "../../db/schema/users";

const SCHEMA_SQL = `
create type administratorrole as enum (
    'full', 'settings', 'spaces', 'users', 'base'
);

create table users (
    id integer primary key generated always as identity,
    active boolean not null,
    administrator_role administratorrole,
    email text not null,
    force_reset boolean not null,
    handle text not null,
    invalidate_sessions boolean not null,
    last_password_change timestamp not null,
    legacy_id text unique,
    password bytea not null,
    settings jsonb not null
);

create unique index users_handle_lower_unique on users (lower(handle));

create table jobs (
    id integer primary key generated always as identity,
    acquired boolean,
    claim jsonb,
    claimed_at timestamp,
    created_at timestamp not null,
    finished_at timestamp,
    key text,
    legacy_id text unique,
    pinged_at timestamp,
    state text not null,
    steps jsonb,
    user_id integer not null,
    workflow text not null
);

create table job_samples (
    job_id integer primary key,
    sample_id text not null
);

create table job_indexes (
    job_id integer primary key,
    index_id text not null
);

create table subtractions (
    id bigint primary key generated always as identity,
    job_id integer unique
);

create table analyses (
    id bigint primary key generated always as identity,
    legacy_id text unique,
    job_id integer
);
`;

/** A test database handle, plus the teardown that drops it. */
export type TestDb = {
	db: ReturnType<typeof drizzle<typeof schema>>;
	close: () => Promise<void>;
};

/**
 * Build an isolated database for one suite. Each suite gets its own Postgres
 * schema on the shared container, so suites running in parallel workers can't
 * see each other's rows.
 */
export async function createTestDb(namespace: string): Promise<TestDb> {
	const url = process.env.VT_POSTGRES_URL;

	if (!url) {
		throw new Error("VT_POSTGRES_URL is not set; is globalSetup running?");
	}

	const admin = postgres(url);
	await admin`drop schema if exists ${admin(namespace)} cascade`;
	await admin`create schema ${admin(namespace)}`;
	await admin.end();

	const client = postgres(url, { connection: { search_path: namespace } });
	await client.unsafe(SCHEMA_SQL);

	return {
		db: drizzle(client, { schema }),
		async close() {
			await client.unsafe(`drop schema if exists "${namespace}" cascade`);
			await client.end();
		},
	};
}

/** Insert a user, returning its id. Pass a role to make them an administrator. */
export async function seedUser(
	db: TestDb["db"],
	handle: string,
	administratorRole: AdministratorRoleName | null = null,
): Promise<number> {
	const rows = await db
		.insert(users)
		.values({
			administratorRole,
			handle,
			lastPasswordChange: new Date(),
			password: Buffer.from("hash"),
			settings: {},
		})
		.returning({ id: users.id });

	return takeFirstOrThrow(rows).id;
}

/** Insert a job owned by `userId`, returning its id. */
export async function seedJob(
	db: TestDb["db"],
	userId: number,
	values: { state: string; workflow?: string; createdAt?: Date },
): Promise<number> {
	const rows = await db
		.insert(jobs)
		.values({
			created_at: values.createdAt ?? new Date(),
			state: values.state,
			user_id: userId,
			workflow: values.workflow ?? "create_sample",
		})
		.returning({ id: jobs.id });

	return takeFirstOrThrow(rows).id;
}
