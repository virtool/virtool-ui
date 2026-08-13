/**
 * Downloading a large file to disk, for task bodies that install a release.
 *
 * The port of Python's `virtool/data/http.py`, with the three guards it does
 * not have. Python's `download_file` streams a response to a path and raises on
 * a status above 399; a connection that accepts and then goes quiet leaves it
 * waiting forever, which under a lease means the claim is held until it expires
 * and the reclaim starts a second stalled download behind the first.
 */

import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { setTimeout as delay } from "node:timers/promises";
import type { Logger } from "@virtool/logger";

/**
 * How long the transfer may go without delivering a byte.
 *
 * An **idle** timeout rather than an overall deadline. A release archive is
 * hundreds of megabytes and a slow but healthy link can legitimately spend many
 * minutes on one; the thing worth failing on is a connection that has stopped
 * producing, and only an idle timer can tell the two apart.
 */
const STALL_TIMEOUT_MS = 60_000;

/** How many times the transfer is attempted before the failure is raised. */
const ATTEMPTS = 4;

/** Base for the exponential backoff between attempts: 1s, 2s, then 4s. */
const BACKOFF_BASE_MS = 1_000;

/** The server answered, and its status says there is nothing to download. */
export class DownloadStatusError extends Error {
	constructor(url: string, status: number) {
		super(`Could not download HMM data: ${url} responded ${status}`);
		this.name = "DownloadStatusError";
	}
}

/** The connection stopped delivering data and was abandoned. */
export class DownloadStalledError extends Error {
	constructor(url: string, ms: number) {
		super(`Could not download HMM data: ${url} stalled for ${ms}ms`);
		this.name = "DownloadStalledError";
	}
}

/** What {@link downloadToFile} accepts alongside its url and path. */
export type DownloadToFileOptions = {
	logger: Logger;
	/** Aborts the request, the transfer, and any backoff waiting to elapse. */
	signal?: AbortSignal;
	/** Called with the running byte count for the current attempt. */
	onProgress?: (received: number) => void;
	/** Overrides for tests. */
	attempts?: number;
	backoffMs?: number;
	stallTimeoutMs?: number;
};

async function attemptDownload(
	url: string,
	path: string,
	options: DownloadToFileOptions,
): Promise<number> {
	const { onProgress, signal, stallTimeoutMs = STALL_TIMEOUT_MS } = options;

	const stalled = new AbortController();

	/*
	 * Composed rather than chosen between: the run's signal ends the transfer on
	 * a drain, and the stall controller ends it when the connection goes quiet.
	 * Passing it to `fetch` covers the body as well as the request — aborting it
	 * destroys the response stream, which is what makes the loop below reject
	 * instead of waiting on bytes that are not coming.
	 */
	const composed = signal
		? AbortSignal.any([signal, stalled.signal])
		: stalled.signal;

	let timer: NodeJS.Timeout | undefined;

	function arm(): void {
		clearTimeout(timer);
		timer = setTimeout(
			() => stalled.abort(new DownloadStalledError(url, stallTimeoutMs)),
			stallTimeoutMs,
		);
	}

	arm();

	try {
		const response = await fetch(url, { signal: composed });

		// Checked before a byte is read, as Python does. An HTML error page fed to
		// a gunzip stream fails two steps later with a message about compression
		// rather than about the 404 that caused it.
		if (response.status > 399) {
			throw new DownloadStatusError(url, response.status);
		}

		if (response.body === null) {
			throw new DownloadStatusError(url, response.status);
		}

		let received = 0;

		/*
		 * `createWriteStream` truncates, so a retry rewrites from zero rather than
		 * appending to what the failed attempt left behind. Nothing here resumes a
		 * partial transfer; the archive is verified only by being a readable tar,
		 * and a resumed download that silently spliced two responses would pass
		 * that check on a corrupt file.
		 */
		await pipeline(async function* () {
			for await (const chunk of response.body as AsyncIterable<Uint8Array>) {
				arm();

				received += chunk.byteLength;
				onProgress?.(received);

				yield chunk;
			}
		}, createWriteStream(path));

		return received;
	} finally {
		clearTimeout(timer);
	}
}

/**
 * Download `url` to `path`, retrying a bounded number of times.
 *
 * Returns the number of bytes written.
 *
 * **Only transport failures are retried.** A status the server chose is
 * reported as it stands: a 404 on a release URL will be a 404 on the next
 * attempt too, and retrying it turns a clear diagnostic into the same
 * diagnostic four minutes later. This is in-process retry only — the task row
 * is never requeued, which stays out of scope.
 *
 * An abort is never retried and is rethrown untranslated. The process is going
 * away, and the framework records that as `aborted` rather than a failure.
 */
export async function downloadToFile(
	url: string,
	path: string,
	options: DownloadToFileOptions,
): Promise<number> {
	const {
		attempts = ATTEMPTS,
		backoffMs = BACKOFF_BASE_MS,
		logger,
		signal,
	} = options;

	let last: unknown;

	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			return await attemptDownload(url, path, options);
		} catch (err) {
			if (signal?.aborted) {
				throw err;
			}

			if (err instanceof DownloadStatusError) {
				throw err;
			}

			last = err;

			if (attempt < attempts) {
				logger.warn(
					{ attempt, attempts, err, url },
					"download failed, retrying",
				);

				await delay(backoffMs * 2 ** (attempt - 1), undefined, { signal });
			}
		}
	}

	throw last;
}
