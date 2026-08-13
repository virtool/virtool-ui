import { createReadStream } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extractTarMembers } from "@virtool/archive/tar";
import { HmmAnnotation } from "@virtool/contracts";
import { cleanHmmStatus, installHmms } from "@virtool/data/hmm/data";
import { z } from "zod";
import { downloadToFile } from "../download";
import { defineTask } from "../framework/define";
import type { TaskContext } from "./registry";

/**
 * `install_hmms` carries the release to install and who asked for it.
 *
 * `installUpdate` (`apps/web/src/server/hmm/service.ts`) is the only thing that
 * writes one of these rows. Python's HMM API used to as well, and no longer
 * does — `virtool/hmm/api.py` is three jobs-API `GET` handlers and nothing that
 * creates a task — so the schema has one writer to satisfy rather than two.
 *
 * `z.object` strips unknown keys rather than rejecting them, so a row carrying
 * a field this side does not read still runs. The release is spelled out
 * because `createUpdateSubdocument` copies nearly all of it onto the status
 * singleton: a field missing here is a field missing from what a user sees
 * recorded against their install.
 */
const payload = z.object({
	release: z.object({
		body: z.string(),
		content_type: z.string(),
		download_url: z.string(),
		filename: z.string(),
		html_url: z.string(),
		id: z.number().int(),
		name: z.string(),
		newer: z.boolean(),
		published_at: z.string(),
		retrieved_at: z.string(),
		size: z.number().int(),
	}),
	user_id: z.number().int(),
});

/** Where the release archive lands, matching Python's `temp_path / "hmm.tar.gz"`. */
const ARCHIVE_NAME = "hmm.tar.gz";

/*
 * The two members of the archive, at the paths Python's `decompress_tgz`
 * leaves them at. Only these two are extracted; everything else in the archive
 * is walked past.
 */
const ANNOTATIONS_MEMBER = "hmm/annotations.json";
const PROFILES_MEMBER = "hmm/profiles.hmm";

/**
 * Install an HMM release: download it, unpack it, and write it to the database
 * and object storage.
 *
 * The port of Python's `HMMInstallTask`, and the first body here to touch an
 * archive, to consume the framework's `cleanup` hook, and to close the loop
 * `installUpdate` opens. **Nothing in this repo set `ready: true` before this
 * task existed** — `createUpdateSubdocument` writes `false` and the install
 * step is what flips it — so without this body the first install wedges
 * `isInstallInProgress` on and every install after it is refused.
 *
 * ## The archive is downloaded to disk rather than piped through
 *
 * Fusing download → gunzip → untar into one pass would save a copy of the
 * archive on disk, and it is deliberately not done: the download is the part
 * that is retried, and a fused pipeline cannot retry it without redoing the
 * extraction from byte zero. The pod therefore needs ephemeral storage for the
 * `.tar.gz` and the extracted profiles at the same time.
 *
 * ## Both members are spooled before the transaction opens
 *
 * A single-pass tar read sees entries in archive order, and nothing in the
 * format guarantees `annotations.json` precedes `profiles.hmm`. The install
 * needs the annotations first — they are inserted, and their count is the
 * progress denominator — and the profiles last, inside the transaction and
 * immediately before the commit. Extracting both in `decompress` makes entry
 * order irrelevant, which is what Python gets incidentally by extracting the
 * whole archive to disk before reading any of it.
 *
 * ## It is idempotent, as a reclaim requires
 *
 * `download` and `decompress` write into a fresh temp directory on every run.
 * `install` short-circuits inside its transaction when the status singleton
 * already records this release as installed, which is what stops a reclaimed
 * re-run appending a second complete set of annotation rows.
 */
export const installHmmsTask = defineTask<typeof payload, TaskContext>({
	type: "install_hmms",
	payload,
	// Python names each step after the bound method it runs, `BaseTask.run`
	// writing `func.__name__` into the column. Both runners write the same three
	// names for the same work until the cutover completes.
	steps: ["download", "decompress", "install"],
	async run({ ctx, helpers, logger, payload, signal }) {
		const { release, user_id: userId } = payload;

		const workPath = await mkdtemp(join(tmpdir(), "vt-install-hmms-"));

		const archivePath = join(workPath, ARCHIVE_NAME);
		const annotationsPath = join(workPath, "annotations.json");
		const profilesPath = join(workPath, "profiles.hmm");

		try {
			await helpers.runStep("download", async (report) => {
				await downloadToFile(release.download_url, archivePath, {
					logger,
					signal,
					onProgress(received) {
						// Guarded rather than divided blind. Python's
						// `AccumulatingProgressHandlerWrapper` divides by the total with
						// no check, so a release whose manifest entry carries `size: 0`
						// is a ZeroDivisionError two lines into the download.
						if (release.size > 0) {
							report(received / release.size);
						}
					},
				});
			});

			await helpers.runStep("decompress", async () => {
				/*
				 * No progress. There is no position worth publishing between the
				 * boundaries the framework already writes, and reporting one would
				 * cost a write and a refetch in every connected browser for a bar
				 * that moves inside a third of its range.
				 */
				await extractTarMembers(
					archivePath,
					{
						[ANNOTATIONS_MEMBER]: annotationsPath,
						[PROFILES_MEMBER]: profilesPath,
					},
					{ gzip: true, signal },
				);
			});

			await helpers.runStep("install", async (report) => {
				const annotations = z
					.array(HmmAnnotation)
					.parse(JSON.parse(await readFile(annotationsPath, "utf8")));

				const performed = await installHmms(
					ctx.db,
					ctx.storage,
					logger,
					{
						annotations,
						// A factory, not a stream: the idempotency short-circuit never
						// reads it, and a stream opened up front would leave its file
						// handle behind on every reclaimed re-run.
						profiles: () => createReadStream(profilesPath),
						release,
						userId,
					},
					// `report` takes a fraction where the data layer publishes percent.
					async (percent) => {
						report(percent / 100);
					},
				);

				if (!performed) {
					logger.info(
						{ release_id: release.id },
						"hmm release was already installed, skipped",
					);
				}
			});
		} finally {
			// Every exit path, including an abort. The archive and the extracted
			// profiles are together larger than the release, and a pod that failed
			// an install still has to have room for the retry.
			await rm(workPath, { force: true, recursive: true });
		}
	},
	async cleanup({ ctx, logger, reason }) {
		/*
		 * Python's `BaseTask` runs `cleanup` only when the task errored, and this
		 * has to match it. `cleanHmmStatus` empties `updates`, which is the state
		 * a re-run reads to decide whether this install already committed — so
		 * running it on a drain would strip the entry the next attempt needs, and
		 * the re-run would write every row and every byte and then record none of
		 * it against a status row that no longer mentions the release. An aborted
		 * task is one that is going to run again; there is nothing to tidy up.
		 */
		if (reason === "aborted") {
			return;
		}

		logger.info("clearing the hmm install status after a failed install");

		await cleanHmmStatus(ctx.db);
	},
});
