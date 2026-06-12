// Read-only mirror of the `jobs` table and its resource junction tables,
// managed by the upstream Python service via Alembic. Do not generate or push
// migrations from this side. Keep the columns in sync with
// `../../../../../../virtool/virtool/jobs/pg.py`.
//
// The legacy Mongo `args` field is not a column. A job's sample and index
// resources live in the `job_samples` / `job_indexes` junction tables, while
// its subtraction and analysis resources are found on the owning rows
// (`subtractions.job_id`, `analyses.job_id`). All are recombined into `args`
// when a job is read.

import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

/** A runner claim payload, stored as JSONB on a job. */
export type JobClaim = {
	cpu: number;
	image: string;
	mem: number;
	runner_id: string;
	runtime_version: string;
	workflow_version: string;
};

/** A workflow step, stored in the `steps` JSONB array on a job. */
export type JobStep = {
	description: string;
	id: string;
	name: string;
	started_at: string | null;
};

export const jobs = pgTable("jobs", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	acquired: boolean("acquired").$defaultFn(() => false),
	claim: jsonb("claim").$type<JobClaim>(),
	claimed_at: timestamp("claimed_at"),
	created_at: timestamp("created_at").notNull(),
	finished_at: timestamp("finished_at"),
	key: text("key"),
	legacy_id: text("legacy_id").unique(),
	pinged_at: timestamp("pinged_at"),
	state: text("state").notNull(),
	steps: jsonb("steps").$type<JobStep[]>(),
	user_id: integer("user_id").notNull(),
	workflow: text("workflow").notNull(),
});

/** A row from the `jobs` table. */
export type JobRow = typeof jobs.$inferSelect;

export const jobSamples = pgTable("job_samples", {
	job_id: integer("job_id").primaryKey(),
	sample_id: text("sample_id").notNull(),
});

export const jobIndexes = pgTable("job_indexes", {
	job_id: integer("job_id").primaryKey(),
	index_id: text("index_id").notNull(),
});
