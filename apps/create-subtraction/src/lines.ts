import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import type { Readable } from "node:stream";
import { createGunzip } from "node:zlib";

/**
 * Lines of a text file, gunzipping on the way through when it is compressed.
 *
 * This is what replaces Python's decompress step. Python now runs `seqkit`,
 * which reads gzip natively, so its genome never lands on disk uncompressed
 * either; the tool is not needed to get that property, only a stream is.
 *
 * The read stream's errors are forwarded into the gunzip by hand. `pipe` does
 * not do it, so a file that vanishes mid-read would otherwise leave the reader
 * waiting on a stream nothing will ever end.
 */
export function readLines(
	path: string,
	{ gzipped }: { gzipped: boolean },
): AsyncIterable<string> {
	const source = createReadStream(path);

	let input: Readable = source;

	if (gzipped) {
		const gunzip = createGunzip();

		source.on("error", (err) => gunzip.destroy(err));
		input = source.pipe(gunzip);
	}

	return createInterface({ input, crlfDelay: Number.POSITIVE_INFINITY });
}
