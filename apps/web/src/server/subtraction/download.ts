import { requireAuthenticatedRequest } from "../auth/middleware";
import { db } from "../db/pg";
import { StorageKeyNotFoundError, storage } from "../storage";
import { getSubtractionFileLocation } from "./data";

function textResponse(message: string, status: number): Response {
	return new Response(message, { status });
}

// One chunk is pulled before the stream is built (see below), so it is enqueued
// ahead of whatever the iterator has left. `ReadableStream.from` would do this
// in one line but is absent from the DOM lib the app project type-checks
// against.
function toStream(
	first: Uint8Array,
	rest: AsyncIterator<Uint8Array>,
): ReadableStream<Uint8Array> {
	return new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(first);
		},
		async pull(controller) {
			const { done, value } = await rest.next();

			if (done) {
				controller.close();
				return;
			}

			controller.enqueue(value);
		},
		async cancel(reason) {
			// A client that aborts the download mid-stream leaves the backend's
			// request open otherwise.
			await rest.return?.(reason);
		},
	});
}

/**
 * Serve a subtraction's FASTA or Bowtie2 file, backing
 * `GET /subtractions/{id}/files/{filename}`.
 *
 * This is a raw route rather than a server function because the client reaches
 * it with a plain `<a href>` — the browser has to see a real response with a
 * `Content-Disposition`, which an RPC call cannot produce. The bytes are
 * streamed straight out of storage, so a multi-GB Bowtie2 index never sits in
 * the Node heap.
 *
 * Being a route means no policy middleware runs, so the authorization floor is
 * enforced here. It is a valid session and nothing more: subtractions carry no
 * per-row rights, and every signed-in user can already read them.
 */
export async function handleSubtractionFile(
	request: Request,
	subtractionId: string,
	filename: string,
): Promise<Response> {
	const session = await requireAuthenticatedRequest(request);
	if (session instanceof Response) {
		return session;
	}

	const id = Number(subtractionId);

	if (!Number.isInteger(id) || id <= 0) {
		return textResponse("Invalid subtraction id", 400);
	}

	const location = await getSubtractionFileLocation(db, id, filename);

	if (location === null) {
		return textResponse("Not found", 404);
	}

	// Headers cannot be taken back once the response is returned, so the first
	// chunk is pulled up front: a row whose bytes are missing becomes a 404 rather
	// than a 200 that fails halfway through. Mirrors what Python's handler does.
	const chunks = storage.read(location.key)[Symbol.asyncIterator]();

	let first: IteratorResult<Uint8Array>;

	try {
		first = await chunks.next();
	} catch (err) {
		if (err instanceof StorageKeyNotFoundError) {
			return textResponse("Not found", 404);
		}
		throw err;
	}

	if (first.done) {
		return textResponse("Not found", 404);
	}

	return new Response(toStream(first.value, chunks), {
		headers: {
			"content-disposition": `attachment; filename=${filename}`,
			"content-length": String(location.size),
			"content-type": "application/octet-stream",
		},
	});
}
