import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { decompressFile, isGzipped } from "@virtool/workflow";
import type { CreateSubtractionStep } from "./types";

/**
 * Put a plain FASTA at `subtraction.fa`, whatever the user uploaded.
 *
 * A non-gzip upload is copied rather than rejected — Python treats the gzip
 * check as a branch, not a validation, and a user is free to upload an
 * uncompressed genome.
 *
 * `isGzipped` reads the two magic bytes. Python opens the file with `gzip.open`,
 * peeks a byte and treats an `OSError` mentioning `"Not a gzipped file"` as
 * false, which decodes a member header to learn the same thing; the two agree on
 * every input and the decompressed bytes are identical either way.
 *
 * Python shells out to `pigz -d` when it has more than one process and `gzip`
 * otherwise. Neither is here: this is `node:zlib`, in process, which is what
 * keeps the image free of a bioinformatics base. The gzip *container* differs
 * between compressors, but nothing reads this run's back except as content.
 */
export const decompressStep: CreateSubtractionStep = {
	id: "decompress",
	description: "Decompress the source genome if it is gzipped.",
	async run({ data, logger }) {
		const { paths } = data;

		if (await isGzipped(paths.upload)) {
			await decompressFile(paths.upload, paths.fasta);

			logger.info({ path: paths.fasta }, "decompressed source genome");

			return;
		}

		await mkdir(dirname(paths.fasta), { recursive: true });
		await copyFile(paths.upload, paths.fasta);

		logger.info(
			{ path: paths.fasta },
			"copied uncompressed source genome verbatim",
		);
	},
};
