import { and, eq, inArray } from "drizzle-orm";
import type { Db } from "../db/pg";
import { type UploadType, uploads } from "../db/schema/uploads";
import { users } from "../db/schema/users";

/** The user an upload is attributed to. */
type UploadUser = {
	id: number;
	handle: string;
};

/** An upload, as the client consumes it. */
export type Upload = {
	id: number;
	created_at: string;
	name: string;
	ready: boolean;
	removed: boolean;
	reserved: boolean;
	size: number;
	type: string;
	uploaded_at: string;
	user: UploadUser;
};

/**
 * The uploads a client is allowed to build something from.
 *
 * Python's list endpoint hard-codes these same three predicates, which is why a
 * reserved or removed upload is never offered for selection. Repeating them
 * here is what makes a by-id lookup safe: the ids come from a URL the user can
 * edit, so they cannot be assumed to have survived a list response.
 */
function isAvailable() {
	return and(
		eq(uploads.ready, true),
		eq(uploads.removed, false),
		eq(uploads.reserved, false),
	);
}

/**
 * Fetch the available uploads with the given ids.
 *
 * Ids that don't exist, or that name an upload which has since been removed or
 * reserved by another sample, are simply absent from the result — it is the
 * caller's job to notice and tell the user. The rows come back in an
 * unspecified order.
 *
 * @param db - the database handle
 * @param ids - the ids to look up
 * @param type - restricts the lookup to uploads of one type
 */
export async function getUploads(
	db: Db,
	ids: number[],
	type?: UploadType,
): Promise<Upload[]> {
	if (ids.length === 0) {
		return [];
	}

	const rows = await db
		.select({
			id: uploads.id,
			createdAt: uploads.createdAt,
			name: uploads.name,
			ready: uploads.ready,
			removed: uploads.removed,
			reserved: uploads.reserved,
			size: uploads.size,
			type: uploads.type,
			uploadedAt: uploads.uploadedAt,
			userId: users.id,
			handle: users.handle,
		})
		.from(uploads)
		.innerJoin(users, eq(uploads.userId, users.id))
		.where(
			and(
				inArray(uploads.id, ids),
				type ? eq(uploads.type, type) : undefined,
				isAvailable(),
			),
		);

	return rows.map((row) => ({
		id: row.id,
		created_at: row.createdAt?.toISOString() ?? "",
		name: row.name ?? "",
		ready: row.ready,
		removed: row.removed,
		reserved: row.reserved,
		size: row.size ?? 0,
		type: row.type ?? "",
		uploaded_at: row.uploadedAt?.toISOString() ?? "",
		user: { id: row.userId, handle: row.handle },
	}));
}
