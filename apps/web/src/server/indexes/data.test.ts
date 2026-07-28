import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Db } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import { legacyHistory } from "../db/schema/history";
import { indexes, indexFiles } from "../db/schema/indexes";
import { legacyOtus } from "../db/schema/otus";
import { legacyReferences } from "../db/schema/references";
import { tasks } from "../db/schema/tasks";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import {
	createIndex,
	findIndexes,
	getIndex,
	IndexBuildInProgressError,
	IndexNotFoundError,
	listReadyIndexes,
	NoUnbuiltChangesError,
	UnverifiedOtusError,
} from "./data";

let database: TestDatabase;
let db: Db;

beforeAll(async () => {
	database = await createTestDatabase();
	db = database.db;
}, 60_000);

afterAll(async () => {
	await database.drop();
});

beforeEach(async () => {
	await db.delete(indexFiles);
	await db.delete(legacyHistory);
	await db.delete(legacyOtus);
	await db.delete(indexes);
	await db.delete(legacyReferences);
	await db.delete(tasks);
	await db.delete(users);
});

let handleCounter = 0;

async function seedUser(): Promise<number> {
	handleCounter += 1;

	return takeFirstOrThrow(
		await db
			.insert(users)
			.values({
				active: true,
				administratorRole: null,
				email: "",
				forceReset: false,
				handle: `user-${handleCounter}`,
				lastPasswordChange: new Date(),
				password: Buffer.from("not-a-real-hash"),
				settings: {},
			})
			.returning({ id: users.id }),
	).id;
}

async function seedReference(
	userId: number,
	{ archived = false, name = "Reference" } = {},
): Promise<number> {
	return takeFirstOrThrow(
		await db
			.insert(legacyReferences)
			.values({
				name,
				description: "",
				organism: "virus",
				created_at: new Date(),
				archived,
				restrict_source_types: false,
				source_types: [],
				user_id: userId,
			})
			.returning({ id: legacyReferences.id }),
	).id;
}

let storageKeyCounter = 0;

async function seedIndex(values: {
	referenceId: number;
	userId: number;
	version: number;
	ready?: boolean;
	createdAt?: Date;
}): Promise<number> {
	storageKeyCounter += 1;

	return takeFirstOrThrow(
		await db
			.insert(indexes)
			.values({
				created_at: values.createdAt ?? new Date(),
				manifest: {},
				ready: values.ready ?? true,
				reference_id: values.referenceId,
				storage_key: `storage-${storageKeyCounter}`,
				user_id: values.userId,
				version: values.version,
			})
			.returning({ id: indexes.id }),
	).id;
}

let otuCounter = 0;

async function seedOtu(
	referenceId: number,
	{ verified = true, name = "OTU", version = 1 } = {},
): Promise<string> {
	otuCounter += 1;
	const id = `otu${otuCounter}`;

	await db.insert(legacyOtus).values({
		id,
		data: {},
		name,
		abbreviation: "",
		reference_id: referenceId,
		verified,
		version,
	});

	return id;
}

let changeCounter = 0;

async function seedChange(values: {
	referenceId: number;
	userId: number;
	otuId: string;
	otuName?: string;
	otuVersion?: string | null;
	indexId?: number;
}): Promise<void> {
	changeCounter += 1;

	await db.insert(legacyHistory).values({
		legacy_id: `${values.otuId}.${changeCounter}`,
		created_at: new Date(),
		description: `Change ${changeCounter}`,
		method_name: "edit",
		user_id: values.userId,
		otu: values.otuId,
		otu_name: values.otuName ?? "OTU",
		otu_version: values.otuVersion === undefined ? "1" : values.otuVersion,
		reference_id: values.referenceId,
		index_id: values.indexId ?? null,
	});
}

describe("findIndexes", () => {
	it("scopes a page to a reference and orders it by descending version", async () => {
		const userId = await seedUser();
		const referenceId = await seedReference(userId);
		const otherId = await seedReference(userId, { name: "Other" });

		await seedIndex({ referenceId, userId, version: 0 });
		await seedIndex({ referenceId, userId, version: 1 });
		await seedIndex({ referenceId: otherId, userId, version: 0 });

		const result = await findIndexes(db, {
			referenceId,
			page: 1,
			perPage: 25,
		});

		expect(result.totalCount).toBe(2);
		expect(result.foundCount).toBe(2);
		expect(result.items.map((item) => item.version)).toEqual([1, 0]);
		expect(result.items[0]?.reference).toEqual({
			id: referenceId,
			name: "Reference",
		});
	});

	it("reports each build's own change and modified-OTU counts", async () => {
		const userId = await seedUser();
		const referenceId = await seedReference(userId);
		const indexId = await seedIndex({ referenceId, userId, version: 0 });

		const first = await seedOtu(referenceId);
		const second = await seedOtu(referenceId);

		await seedChange({ referenceId, userId, otuId: first, indexId });
		await seedChange({ referenceId, userId, otuId: first, indexId });
		await seedChange({ referenceId, userId, otuId: second, indexId });

		const result = await findIndexes(db, {
			referenceId,
			page: 1,
			perPage: 25,
		});

		expect(result.items[0]?.changeCount).toBe(3);
		expect(result.items[0]?.modifiedOtuCount).toBe(2);
	});

	it("reports zero counts for a build no change points at", async () => {
		const userId = await seedUser();
		const referenceId = await seedReference(userId);
		await seedIndex({ referenceId, userId, version: 0 });

		const result = await findIndexes(db, {
			referenceId,
			page: 1,
			perPage: 25,
		});

		expect(result.items[0]?.changeCount).toBe(0);
		expect(result.items[0]?.modifiedOtuCount).toBe(0);
	});

	// The top-level counts describe what the *next* build would include, not the
	// page — a list view uses them to decide whether to offer a rebuild.
	it("reports the reference's unbuilt totals alongside the page", async () => {
		const userId = await seedUser();
		const referenceId = await seedReference(userId);
		const indexId = await seedIndex({ referenceId, userId, version: 0 });

		const first = await seedOtu(referenceId);
		const second = await seedOtu(referenceId);
		await seedOtu(referenceId);

		await seedChange({ referenceId, userId, otuId: first, indexId });
		await seedChange({ referenceId, userId, otuId: first });
		await seedChange({ referenceId, userId, otuId: second });

		const result = await findIndexes(db, {
			referenceId,
			page: 1,
			perPage: 25,
		});

		expect(result.changeCount).toBe(2);
		expect(result.modifiedOtuCount).toBe(2);
		expect(result.totalOtuCount).toBe(3);
	});

	it("filters an unscoped page by its reference's archived state", async () => {
		const userId = await seedUser();
		const active = await seedReference(userId);
		const archived = await seedReference(userId, {
			archived: true,
			name: "Archived",
		});

		await seedIndex({ referenceId: active, userId, version: 0 });
		await seedIndex({ referenceId: archived, userId, version: 0 });

		const result = await findIndexes(db, {
			page: 1,
			perPage: 25,
			archived: false,
		});

		expect(result.totalCount).toBe(2);
		expect(result.foundCount).toBe(1);
		expect(result.items).toHaveLength(1);
		expect(result.items[0]?.reference.id).toBe(active);
	});
});

describe("listReadyIndexes", () => {
	it("returns only finished builds, oldest first", async () => {
		const userId = await seedUser();
		const referenceId = await seedReference(userId);

		await seedIndex({
			referenceId,
			userId,
			version: 0,
			createdAt: new Date("2024-01-02"),
		});
		await seedIndex({
			referenceId,
			userId,
			version: 1,
			createdAt: new Date("2024-01-01"),
		});
		await seedIndex({ referenceId, userId, version: 2, ready: false });

		const result = await listReadyIndexes(db);

		expect(result.map((index) => index.version)).toEqual([1, 0]);
	});

	it("filters by the reference's archived state", async () => {
		const userId = await seedUser();
		const active = await seedReference(userId);
		const archived = await seedReference(userId, {
			archived: true,
			name: "Archived",
		});

		await seedIndex({ referenceId: active, userId, version: 0 });
		await seedIndex({ referenceId: archived, userId, version: 0 });

		const result = await listReadyIndexes(db, false);

		expect(result).toHaveLength(1);
		expect(result[0]?.reference.id).toBe(active);
	});
});

describe("getIndex", () => {
	it("throws when the index does not exist", async () => {
		await expect(getIndex(db, 404)).rejects.toBeInstanceOf(IndexNotFoundError);
	});

	it("returns the contributors, OTUs, files, and manifest", async () => {
		const userId = await seedUser();
		const otherId = await seedUser();
		const referenceId = await seedReference(userId);
		const indexId = await seedIndex({ referenceId, userId, version: 0 });

		await db
			.update(indexes)
			.set({ manifest: { abc: 3 } })
			.where(eq(indexes.id, indexId));

		const zebra = await seedOtu(referenceId);
		const alpha = await seedOtu(referenceId);

		await seedChange({
			referenceId,
			userId,
			otuId: zebra,
			otuName: "Zebra virus",
			indexId,
		});
		await seedChange({
			referenceId,
			userId: otherId,
			otuId: zebra,
			otuName: "Zebra virus",
			otuVersion: "2",
			indexId,
		});
		await seedChange({
			referenceId,
			userId,
			otuId: alpha,
			otuName: "Alpha virus",
			indexId,
		});

		await db.insert(indexFiles).values({
			index_id: indexId,
			name: "reference.fa.gz",
			size: 2048,
			type: "fasta",
		});

		const index = await getIndex(db, indexId);

		expect(index.manifest).toEqual({ abc: 3 });

		expect(index.contributors).toEqual([
			{ id: userId, handle: expect.any(String), count: 2 },
			{ id: otherId, handle: expect.any(String), count: 1 },
		]);

		// Sorted by name, so Alpha precedes Zebra despite being seeded second.
		expect(index.otus).toEqual([
			{ id: alpha, name: "Alpha virus", changeCount: 1 },
			{ id: zebra, name: "Zebra virus", changeCount: 2 },
		]);

		expect(index.files).toEqual([
			{
				downloadUrl: `/indexes/${indexId}/files/reference.fa.gz`,
				id: expect.any(Number),
				index: indexId,
				name: "reference.fa.gz",
				size: 2048,
				type: "fasta",
			},
		]);
	});
});

describe("createIndex", () => {
	async function seedBuildable(): Promise<{
		userId: number;
		referenceId: number;
		otuId: string;
	}> {
		const userId = await seedUser();
		const referenceId = await seedReference(userId);
		const otuId = await seedOtu(referenceId, { version: 4 });

		await seedChange({ referenceId, userId, otuId });

		return { userId, referenceId, otuId };
	}

	it("inserts a pending build pinned to the live OTU versions", async () => {
		const { userId, referenceId, otuId } = await seedBuildable();

		const index = await createIndex(db, referenceId, userId);

		expect(index.version).toBe(0);
		expect(index.ready).toBe(false);
		expect(index.manifest).toEqual({ [otuId]: 4 });
		expect(index.user.id).toBe(userId);
		expect(index.reference.id).toBe(referenceId);
	});

	it("stamps every unbuilt change with the new build", async () => {
		const { userId, referenceId, otuId } = await seedBuildable();
		await seedChange({ referenceId, userId, otuId });

		const index = await createIndex(db, referenceId, userId);

		const rows = await db
			.select({ indexId: legacyHistory.index_id })
			.from(legacyHistory);

		expect(rows).toHaveLength(2);
		expect(rows.every((row) => row.indexId === index.id)).toBe(true);
		expect(index.changeCount).toBe(2);
	});

	it("creates the task the Python runner claims and points it at the index", async () => {
		const { userId, referenceId } = await seedBuildable();

		const index = await createIndex(db, referenceId, userId);

		const [task] = await db
			.select({
				id: tasks.id,
				type: tasks.type,
				step: tasks.step,
				complete: tasks.complete,
				context: tasks.context,
			})
			.from(tasks);

		expect(task?.type).toBe("create_index");
		expect(task?.step).toBe("create_index");
		expect(task?.complete).toBe(false);
		expect(task?.context).toEqual({ index_id: index.id });

		const [row] = await db
			.select({ taskId: indexes.task_id, jobId: indexes.job_id })
			.from(indexes)
			.where(eq(indexes.id, index.id));

		expect(row?.taskId).toBe(task?.id);
		expect(row?.jobId).toBeNull();
	});

	// Versions count from zero and never reuse a number, so a build started after
	// another finished picks up where it left off.
	it("numbers a build one above the highest existing version", async () => {
		const { userId, referenceId } = await seedBuildable();
		await seedIndex({ referenceId, userId, version: 7 });

		const index = await createIndex(db, referenceId, userId);

		expect(index.version).toBe(8);
	});

	it("refuses when a build is already in progress", async () => {
		const { userId, referenceId } = await seedBuildable();
		await seedIndex({ referenceId, userId, version: 0, ready: false });

		await expect(createIndex(db, referenceId, userId)).rejects.toBeInstanceOf(
			IndexBuildInProgressError,
		);
	});

	it("refuses when the reference has unverified OTUs", async () => {
		const { userId, referenceId } = await seedBuildable();
		await seedOtu(referenceId, { verified: false });

		await expect(createIndex(db, referenceId, userId)).rejects.toBeInstanceOf(
			UnverifiedOtusError,
		);
	});

	it("refuses when there is nothing to build", async () => {
		const userId = await seedUser();
		const referenceId = await seedReference(userId);
		await seedOtu(referenceId);

		await expect(createIndex(db, referenceId, userId)).rejects.toBeInstanceOf(
			NoUnbuiltChangesError,
		);
	});

	// The pre-lock check is a fast path; the one inside the locked transaction is
	// what actually serialises two builds racing for the same reference. Both
	// reject with the same error, so a caller cannot tell which fired.
	it("lets only one of two concurrent builds through", async () => {
		const { userId, referenceId } = await seedBuildable();

		const results = await Promise.allSettled([
			createIndex(db, referenceId, userId),
			createIndex(db, referenceId, userId),
		]);

		const fulfilled = results.filter((r) => r.status === "fulfilled");
		const rejected = results.filter((r) => r.status === "rejected");

		expect(fulfilled).toHaveLength(1);
		expect(rejected).toHaveLength(1);
		expect(rejected[0]?.reason).toBeInstanceOf(IndexBuildInProgressError);

		const rows = await db.select({ id: indexes.id }).from(indexes);
		expect(rows).toHaveLength(1);
	});
});
