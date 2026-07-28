import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import type { Db } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import { legacyHistory } from "../db/schema/history";
import { indexes, indexFiles } from "../db/schema/indexes";
import { legacyOtus } from "../db/schema/otus";
import {
	legacyReferences,
	legacyReferenceUsers,
} from "../db/schema/references";
import { sessions } from "../db/schema/sessions";
import { tasks } from "../db/schema/tasks";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import { callServerFn, type SplitServerFnModule } from "../test/serverFn";

const getRequest = vi.fn();
const setResponseStatus = vi.fn();

vi.mock("@tanstack/react-start/server", () => ({
	deleteCookie: vi.fn(),
	getCookie: vi.fn(),
	getRequest,
	setCookie: vi.fn(),
	setResponseStatus,
}));

vi.mock("@sentry/tanstackstart-react", () => ({
	captureException: vi.fn(),
	setUser: vi.fn(),
}));

let db: Db;
vi.mock("../db/pg", () => ({
	client: {},
	get db() {
		return db;
	},
}));

const emit = vi.fn();
vi.mock("../events/emit", () => ({
	emit: (...args: unknown[]) => emit(...args),
}));

const handlers = (await import(
	"./functions.ts?tss-serverfn-split"
)) as SplitServerFnModule;
const { ForbiddenError, UnauthorizedError } = await import(
	"../auth/middleware"
);
const { SESSION_ID_COOKIE, SESSION_TOKEN_COOKIE } = await import(
	"../auth/cookies"
);
const { seedSession, seedUser } = await import("../auth/test/fixtures");

let database: TestDatabase;

beforeAll(async () => {
	database = await createTestDatabase();
	db = database.db;
}, 60_000);

afterAll(async () => {
	await database.drop();
});

beforeEach(async () => {
	vi.clearAllMocks();
	await db.delete(sessions);
	await db.delete(indexFiles);
	await db.delete(legacyHistory);
	await db.delete(legacyOtus);
	await db.delete(indexes);
	await db.delete(legacyReferenceUsers);
	await db.delete(legacyReferences);
	await db.delete(tasks);
	await db.delete(users);

	getRequest.mockReturnValue(
		new Request("https://virtool.test/_serverFn/test"),
	);
});

let handleCounter = 0;

async function signIn(): Promise<number> {
	handleCounter += 1;
	const userId = await seedUser(db, { handle: `user-${handleCounter}` });
	const { sessionId, token } = await seedSession(db, userId);

	getRequest.mockReturnValue(
		new Request("https://virtool.test/_serverFn/test", {
			headers: {
				cookie: `${SESSION_ID_COOKIE}=${sessionId}; ${SESSION_TOKEN_COOKIE}=${token}`,
			},
		}),
	);

	return userId;
}

async function seedReference(
	userId: number,
	{ archived = false, build = true } = {},
): Promise<number> {
	const referenceId = takeFirstOrThrow(
		await db
			.insert(legacyReferences)
			.values({
				name: "Reference",
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

	await db.insert(legacyReferenceUsers).values({
		reference_id: referenceId,
		user_id: userId,
		build,
		modify: false,
		modify_otu: false,
	});

	return referenceId;
}

let changeCounter = 0;

async function seedBuildable(
	userId: number,
	referenceId: number,
): Promise<string> {
	changeCounter += 1;
	const otuId = `otu${changeCounter}`;

	await db.insert(legacyOtus).values({
		id: otuId,
		data: {},
		name: "Test virus",
		abbreviation: "",
		reference_id: referenceId,
		verified: true,
		version: 1,
	});

	await db.insert(legacyHistory).values({
		legacy_id: `${otuId}.1`,
		created_at: new Date(),
		description: "Created Test virus",
		method_name: "create",
		user_id: userId,
		otu: otuId,
		otu_name: "Test virus",
		otu_version: "1",
		reference_id: referenceId,
	});

	return otuId;
}

function call(name: string, data?: unknown) {
	return callServerFn(handlers, name, data);
}

describe("authorization", () => {
	it("refuses every function without a session", async () => {
		await expect(
			call("findIndexesFn", { referenceId: 1, page: 1, per_page: 25 }),
		).rejects.toBeInstanceOf(UnauthorizedError);
		await expect(call("listReadyIndexesFn", {})).rejects.toBeInstanceOf(
			UnauthorizedError,
		);
		await expect(call("getIndexFn", { indexId: 1 })).rejects.toBeInstanceOf(
			UnauthorizedError,
		);
		await expect(
			call("findUnbuiltChangesFn", { referenceId: 1, page: 1, per_page: 25 }),
		).rejects.toBeInstanceOf(UnauthorizedError);
		await expect(
			call("createIndexFn", { referenceId: 1 }),
		).rejects.toBeInstanceOf(UnauthorizedError);
	});

	it("refuses a build without the reference's build right", async () => {
		const userId = await signIn();
		const referenceId = await seedReference(userId, { build: false });
		await seedBuildable(userId, referenceId);

		await expect(call("createIndexFn", { referenceId })).rejects.toBeInstanceOf(
			ForbiddenError,
		);
	});
});

describe("getIndexFn", () => {
	it("answers 404 for an index that does not exist", async () => {
		await signIn();

		await expect(call("getIndexFn", { indexId: 404 })).rejects.toThrow(
			"Index not found.",
		);
		expect(setResponseStatus).toHaveBeenCalledWith(404);
	});
});

describe("findUnbuiltChangesFn", () => {
	it("returns only the changes no build covers yet", async () => {
		const userId = await signIn();
		const referenceId = await seedReference(userId);
		await seedBuildable(userId, referenceId);

		const built = takeFirstOrThrow(
			await db
				.insert(indexes)
				.values({
					created_at: new Date(),
					manifest: {},
					ready: true,
					reference_id: referenceId,
					storage_key: "already-built",
					user_id: userId,
					version: 0,
				})
				.returning({ id: indexes.id }),
		).id;

		await db.insert(legacyHistory).values({
			legacy_id: "otuBuilt.1",
			created_at: new Date(),
			description: "Already built",
			method_name: "edit",
			user_id: userId,
			otu: "otuBuilt",
			otu_name: "Built virus",
			otu_version: "1",
			reference_id: referenceId,
			index_id: built,
		});

		const result = (await call("findUnbuiltChangesFn", {
			referenceId,
			page: 1,
			per_page: 25,
		})) as {
			items: { description: string; index: unknown }[];
			foundCount: number;
			totalCount: number;
		};

		// `totalCount` counts every change in the reference so a caller can tell
		// "nothing unbuilt" from "no history at all".
		expect(result.totalCount).toBe(2);
		expect(result.foundCount).toBe(1);
		expect(result.items).toHaveLength(1);
		expect(result.items[0]?.description).toBe("Created Test virus");
		expect(result.items[0]?.index).toBeNull();
	});
});

describe("createIndexFn", () => {
	it("builds the index and announces it", async () => {
		const userId = await signIn();
		const referenceId = await seedReference(userId);
		await seedBuildable(userId, referenceId);

		const index = (await call("createIndexFn", { referenceId })) as {
			id: number;
			version: number;
			ready: boolean;
		};

		expect(index.version).toBe(0);
		expect(index.ready).toBe(false);
		expect(setResponseStatus).toHaveBeenCalledWith(201);
		// The integer id, not a stringified one — the client's `SseMessageSchema`
		// rejects a string here and would drop the invalidation (VIR-2794).
		expect(emit).toHaveBeenCalledWith("indexes", index.id, "create");
	});

	it("answers 409 for an archived reference", async () => {
		const userId = await signIn();
		const referenceId = await seedReference(userId, { archived: true });
		await seedBuildable(userId, referenceId);

		await expect(call("createIndexFn", { referenceId })).rejects.toThrow(
			"Reference is archived",
		);
		expect(setResponseStatus).toHaveBeenCalledWith(409);
	});

	it("answers 409 when a build is already in progress", async () => {
		const userId = await signIn();
		const referenceId = await seedReference(userId);
		await seedBuildable(userId, referenceId);

		await db.insert(indexes).values({
			created_at: new Date(),
			manifest: {},
			ready: false,
			reference_id: referenceId,
			storage_key: "in-progress",
			user_id: userId,
			version: 0,
		});

		await expect(call("createIndexFn", { referenceId })).rejects.toThrow(
			"Index build already in progress",
		);
		expect(setResponseStatus).toHaveBeenCalledWith(409);
	});

	// Both "nothing to build" outcomes are 400s upstream rather than conflicts,
	// and the rebuild dialog matches on the unverified message to explain it.
	it("answers 400 for unverified OTUs", async () => {
		const userId = await signIn();
		const referenceId = await seedReference(userId);
		await seedBuildable(userId, referenceId);

		await db.insert(legacyOtus).values({
			id: "unverified",
			data: {},
			name: "Unverified virus",
			abbreviation: "",
			reference_id: referenceId,
			verified: false,
			version: 1,
		});

		await expect(call("createIndexFn", { referenceId })).rejects.toThrow(
			"There are unverified OTUs",
		);
		expect(setResponseStatus).toHaveBeenCalledWith(400);
	});

	it("answers 400 when there is nothing to build", async () => {
		const userId = await signIn();
		const referenceId = await seedReference(userId);

		await expect(call("createIndexFn", { referenceId })).rejects.toThrow(
			"There are no unbuilt changes",
		);
		expect(setResponseStatus).toHaveBeenCalledWith(400);
	});
});
