import { and, count, desc, eq } from "drizzle-orm";
import type { DbOrTx } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import { type UploadRow, uploads as uploadsTable } from "../db/schema/uploads";
import { users as usersTable } from "../db/schema/users";
import { AppError } from "../errors";
import { emit } from "../events/emit";
import type { StorageBackend } from "../storage";
import { uploadFileKey } from "../storage";

/** The upload types Python's `ck_uploads_type` constraint permits. */
export const UPLOAD_TYPES = ["reference", "reads", "subtraction"] as const;

/** One of the allowed upload types. */
export type UploadType = (typeof UPLOAD_TYPES)[number];

/** The uploading user, matching the legacy `UserNested` wire shape. */
export type UploadUserNested = {
	id: number;
	handle: string;
};

/**
 * An upload as returned to the client. Mirrors Python's `UploadMinimal`:
 * `name_on_disk` and `space` are internal and never exposed.
 *
 * Every field but `removed_at` and `user` is non-null: the columns are nullable
 * at the database level, but Python sets them all when it creates a row and
 * `findUploads` only ever returns `ready` rows, so a listed or created upload
 * always carries them.
 */
export type Upload = {
	id: number;
	created_at: string;
	name: string;
	ready: boolean;
	removed: boolean;
	removed_at: string | null;
	reserved: boolean;
	size: number;
	type: string;
	uploaded_at: string;
	user: UploadUserNested | null;
};

/** A page of upload search results. */
export type UploadSearchResults = {
	items: Upload[];
	found_count: number;
	total_count: number;
	page: number;
	page_count: number;
	per_page: number;
};

/** Fields needed to create an upload; `body` streams straight to storage. */
export type UploadCreateValues = {
	name: string;
	type: UploadType;
	userId: number;
	body: AsyncIterable<Uint8Array>;
};

/** Thrown when a requested upload does not exist or is already removed. */
export class UploadNotFoundError extends AppError {}

/** Thrown when a reserved upload is deleted while still in use. */
export class UploadReservedError extends AppError {}

function toUpload(row: UploadRow, user: UploadUserNested | null): Upload {
	return {
		id: row.id,
		created_at: row.createdAt?.toISOString() ?? "",
		name: row.name ?? "",
		ready: row.ready,
		removed: row.removed,
		removed_at: row.removedAt?.toISOString() ?? null,
		reserved: row.reserved,
		size: row.size ?? 0,
		type: row.type ?? "",
		uploaded_at: row.uploadedAt?.toISOString() ?? "",
		user,
	};
}

async function fetchUser(
	db: DbOrTx,
	userId: number,
): Promise<UploadUserNested | null> {
	const [row] = await db
		.select({ id: usersTable.id, handle: usersTable.handle })
		.from(usersTable)
		.where(eq(usersTable.id, userId));

	return row ?? null;
}

export async function findUploads(
	db: DbOrTx,
	uploadType: UploadType | undefined,
	page: number,
	perPage: number,
	userId?: number,
): Promise<UploadSearchResults> {
	// A visible upload is finished, not deleted, and not held for a sample that
	// is mid-creation. Python applies the same three base filters unconditionally.
	const baseFilters = [
		eq(uploadsTable.ready, true),
		eq(uploadsTable.removed, false),
		eq(uploadsTable.reserved, false),
	];

	const filters = [...baseFilters];
	if (userId !== undefined) {
		filters.push(eq(uploadsTable.userId, userId));
	}
	if (uploadType) {
		filters.push(eq(uploadsTable.type, uploadType));
	}

	const skip = page > 1 ? (page - 1) * perPage : 0;

	const [[foundRow], [totalRow], rows] = await Promise.all([
		db
			.select({ value: count() })
			.from(uploadsTable)
			.where(and(...filters)),
		db
			.select({ value: count() })
			.from(uploadsTable)
			.where(and(...baseFilters)),
		db
			.select({
				upload: uploadsTable,
				user: { id: usersTable.id, handle: usersTable.handle },
			})
			.from(uploadsTable)
			.leftJoin(usersTable, eq(usersTable.id, uploadsTable.userId))
			.where(and(...filters))
			.orderBy(desc(uploadsTable.createdAt))
			.limit(perPage)
			.offset(skip),
	]);

	const foundCount = foundRow?.value ?? 0;

	return {
		items: rows.map((row) =>
			toUpload(row.upload, row.user?.id != null ? row.user : null),
		),
		found_count: foundCount,
		total_count: totalRow?.value ?? 0,
		page,
		page_count: perPage > 0 ? Math.ceil(foundCount / perPage) : 0,
		per_page: perPage,
	};
}

export async function createUpload(
	db: DbOrTx,
	storage: StorageBackend,
	values: UploadCreateValues,
): Promise<Upload> {
	const now = new Date();
	const nameOnDisk = `${crypto.randomUUID()}-${values.name}`;

	const size = await storage.write(uploadFileKey(nameOnDisk), values.body);

	const row = takeFirstOrThrow(
		await db
			.insert(uploadsTable)
			.values({
				createdAt: now,
				name: values.name,
				nameOnDisk,
				ready: true,
				removed: false,
				reserved: false,
				size,
				type: values.type,
				uploadedAt: now,
				userId: values.userId,
			})
			.returning(),
	);

	await emit("uploads", row.id, "create");

	return toUpload(row, await fetchUser(db, row.userId));
}

export async function deleteUpload(
	db: DbOrTx,
	storage: StorageBackend,
	uploadId: number,
): Promise<void> {
	const [row] = await db
		.select()
		.from(uploadsTable)
		.where(eq(uploadsTable.id, uploadId));

	if (!row || row.removed) {
		throw new UploadNotFoundError();
	}

	if (row.reserved) {
		throw new UploadReservedError();
	}

	await db
		.update(uploadsTable)
		.set({ removed: true, removedAt: new Date() })
		.where(eq(uploadsTable.id, uploadId));

	await storage.delete(uploadFileKey(row.nameOnDisk ?? ""));

	await emit("uploads", uploadId, "delete");
}
