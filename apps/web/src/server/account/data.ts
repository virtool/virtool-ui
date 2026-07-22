import { createHash, randomBytes } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import type { Db } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import { type ApiKeyRow, apiKeys as apiKeysTable } from "../db/schema/apiKeys";
import type { GroupPermissions } from "../db/schema/groups";
import { AppError } from "../errors";
import { getUser } from "../users/data";

/** An account API key as returned to the API-key management UI. */
export type ApiKey = {
	id: number;
	created_at: string;
	name: string;
	permissions: GroupPermissions;
};

/** An API key paired with its raw secret, returned only once at creation. */
export type CreatedApiKey = {
	key: string;
	apiKey: ApiKey;
};

/** Thrown when a requested API key does not exist on the user's account. */
export class ApiKeyNotFoundError extends AppError {}

function basePermissions(): GroupPermissions {
	return {
		cancel_job: false,
		create_ref: false,
		create_sample: false,
		modify_hmm: false,
		modify_subtraction: false,
		remove_file: false,
		remove_job: false,
		upload_file: false,
	};
}

/**
 * Clamp `permissions` so no value exceeds the matching one in `limit`. Mirrors
 * `limit_permissions` in the Python service: a key can never report a
 * permission its owner no longer holds.
 */
function limitPermissions(
	permissions: GroupPermissions,
	limit: GroupPermissions,
): GroupPermissions {
	const result = basePermissions();
	for (const key of Object.keys(result) as (keyof GroupPermissions)[]) {
		result[key] = permissions[key] && limit[key];
	}
	return result;
}

function toApiKey(row: ApiKeyRow, permissions: GroupPermissions): ApiKey {
	return {
		id: row.id,
		created_at: row.createdAt.toISOString(),
		name: row.name,
		permissions,
	};
}

function generateKey(): { raw: string; hashed: string } {
	const raw = randomBytes(32).toString("hex");
	return { raw, hashed: createHash("sha256").update(raw).digest("hex") };
}

/**
 * List the account's API keys with their stored permissions.
 *
 * The list is deliberately not clamped, mirroring the Python service: only the
 * single-key read (and the representation returned from create/update) clamps
 * to the owner's current permissions.
 */
export async function findApiKeys(db: Db, userId: number): Promise<ApiKey[]> {
	const rows = await db
		.select()
		.from(apiKeysTable)
		.where(eq(apiKeysTable.userId, userId))
		.orderBy(asc(apiKeysTable.id));

	return rows.map((row) => toApiKey(row, row.permissions));
}

/**
 * Read a single API key, clamping its permissions to the owner's current
 * permissions unless the owner is an administrator.
 */
export async function getApiKey(
	db: Db,
	userId: number,
	keyId: number,
): Promise<ApiKey> {
	const user = await getUser(db, userId);

	const [row] = await db
		.select()
		.from(apiKeysTable)
		.where(and(eq(apiKeysTable.id, keyId), eq(apiKeysTable.userId, userId)))
		.limit(1);

	if (!row) {
		throw new ApiKeyNotFoundError();
	}

	const permissions = user.administrator_role
		? row.permissions
		: limitPermissions(row.permissions, user.permissions);

	return toApiKey(row, permissions);
}

export async function createApiKey(
	db: Db,
	userId: number,
	values: { name: string; permissions: Partial<GroupPermissions> },
): Promise<CreatedApiKey> {
	const { raw, hashed } = generateKey();

	const row = takeFirstOrThrow(
		await db
			.insert(apiKeysTable)
			.values({
				hashed,
				name: values.name,
				createdAt: new Date(),
				userId,
				permissions: { ...basePermissions(), ...values.permissions },
			})
			.returning(),
	);

	return { key: raw, apiKey: await getApiKey(db, userId, row.id) };
}

export async function updateApiKey(
	db: Db,
	userId: number,
	keyId: number,
	permissions: Partial<GroupPermissions>,
): Promise<ApiKey> {
	const [existing] = await db
		.select({ permissions: apiKeysTable.permissions })
		.from(apiKeysTable)
		.where(and(eq(apiKeysTable.id, keyId), eq(apiKeysTable.userId, userId)))
		.limit(1);

	if (!existing) {
		throw new ApiKeyNotFoundError();
	}

	await db
		.update(apiKeysTable)
		.set({ permissions: { ...existing.permissions, ...permissions } })
		.where(and(eq(apiKeysTable.id, keyId), eq(apiKeysTable.userId, userId)));

	return getApiKey(db, userId, keyId);
}

export async function deleteApiKey(
	db: Db,
	userId: number,
	keyId: number,
): Promise<void> {
	const [row] = await db
		.delete(apiKeysTable)
		.where(and(eq(apiKeysTable.id, keyId), eq(apiKeysTable.userId, userId)))
		.returning({ id: apiKeysTable.id });

	if (!row) {
		throw new ApiKeyNotFoundError();
	}
}
