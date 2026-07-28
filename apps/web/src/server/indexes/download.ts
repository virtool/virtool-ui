import { requireAuthenticatedRequest } from "../auth/middleware";
import { db } from "../db/pg";
import { contentDisposition, textResponse, toStream } from "../http";
import {
	checkReferenceVisibility,
	resolveReferenceActor,
} from "../references/data";
import { StorageKeyNotFoundError, storage } from "../storage";
import { getIndexFileKey, getIndexReferenceId } from "./data";

/**
 * Serve one of a build's artifacts, backing
 * `GET /indexes/{indexId}/files/{filename}`.
 *
 * This is a raw route rather than a server function because the client reaches
 * it with a plain `<a href>` — the browser has to see a real response with a
 * `Content-Disposition`, which an RPC call cannot produce. The bytes are
 * streamed straight out of storage, so a multi-GB Bowtie2 index never sits in
 * the Node heap.
 *
 * Being a route means no policy middleware runs, so the authorization floor is
 * enforced here, and it is more than a valid session: an index is only as
 * visible as the reference it was built from, so the caller must be able to see
 * that reference. Without this any signed-in user could read every reference's
 * builds.
 */
export async function handleIndexFile(
	request: Request,
	indexId: string,
	filename: string,
): Promise<Response> {
	const session = await requireAuthenticatedRequest(request);
	if (session instanceof Response) {
		return session;
	}

	const id = Number(indexId);

	if (!Number.isInteger(id) || id <= 0) {
		return textResponse("Invalid index id", 400);
	}

	const referenceId = await getIndexReferenceId(db, id);

	if (referenceId === null) {
		return textResponse("Not found", 404);
	}

	const actor = await resolveReferenceActor(db, session.userId);

	if (!(await checkReferenceVisibility(db, referenceId, actor))) {
		return textResponse("Forbidden", 403);
	}

	const key = await getIndexFileKey(db, id, filename);

	if (key === null) {
		return textResponse("Not found", 404);
	}

	// `Content-Length` comes from the object rather than the `index_files` row:
	// the column is nullable and records what the build task wrote, so a stale or
	// null value would truncate the download client-side. Sizing first also
	// settles existence before any header is committed — a row whose bytes are
	// missing becomes a 404 rather than a 200 that dies mid-stream.
	let size: number;

	try {
		size = await storage.size(key);
	} catch (err) {
		if (err instanceof StorageKeyNotFoundError) {
			return textResponse("Not found", 404);
		}
		throw err;
	}

	return new Response(toStream(storage.read(key)), {
		headers: {
			"content-disposition": contentDisposition(filename),
			"content-length": String(size),
			"content-type": "application/octet-stream",
		},
	});
}
