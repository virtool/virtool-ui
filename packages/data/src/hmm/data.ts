import { Readable } from "node:stream";
import { setImmediate } from "node:timers/promises";
import { createGzip } from "node:zlib";
import type {
	Hmm,
	HmmAnnotation,
	HmmAnnotationRecord,
	HmmMinimal,
	HmmSearchResult,
	HmmStatus,
	Task,
} from "@virtool/contracts";
import type { Logger } from "@virtool/logger";
import {
	HMM_ANNOTATIONS_KEY,
	HMM_PROFILES_KEY,
	type StorageBackend,
} from "@virtool/storage";
import { and, asc, count, eq, gt, sql } from "drizzle-orm";
import type { Db, DbOrTx } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import {
	HMM_STATUS_ID,
	type HmmRelease,
	type HmmRow,
	type HmmUpdate,
	hmms,
	legacyHmmStatus,
} from "../db/schema/hmms";
import { tasks } from "../db/schema/tasks";
import { users } from "../db/schema/users";
import { AppError } from "../errors";

/** The task type the runner matches to run an HMM install. */
export const HMM_INSTALL_TASK_TYPE = "install_hmms";

const MANIFEST_URL = "https://www.virtool.ca/releases/hmms.json";

/**
 * How long the manifest fetch may take before it is abandoned.
 *
 * `fetch` has no timeout of its own, and this call is made from a periodic task
 * whose claim is a lease. A connection that hangs rather than refusing would
 * hold that lease open until it expired, at which point another runner reclaims
 * the task and starts a second hung fetch behind the first.
 */
const MANIFEST_TIMEOUT_MS = 10_000;

/**
 * The record returned when an install is started. Mirrors the GitHub releases
 * API payload shape (plus the appended install metadata), so it stays
 * snake_case rather than following this domain's camelCase convention.
 */
export type HmmInstalled = {
	body: string;
	created_at: string;
	filename: string;
	html_url: string;
	id: number;
	name: string;
	newer: boolean;
	published_at: string;
	ready: boolean;
	size: number;
	user: { id: number; handle: string };
};

/** Filters and pagination accepted by {@link findHmms}. */
export type FindHmmsOptions = {
	page: number;
	perPage: number;
	term: string;
};

/** Thrown when a requested HMM does not exist. */
export class HmmNotFoundError extends AppError {}

/** Thrown when the HMM status singleton row is absent. */
export class HmmStatusNotFoundError extends AppError {}

/** Thrown when an install is requested while another is still in progress. */
export class HmmInstallConflictError extends AppError {}

/** Thrown when the release manifest cannot be fetched or no release is available. */
export class HmmReleaseError extends AppError {}

function hmmMinimal(row: HmmRow): HmmMinimal {
	return {
		id: row.id,
		cluster: row.cluster,
		count: row.count,
		families: row.families,
		names: row.names,
	};
}

// Mirror of the Python `_compose_hmm_search_filter`: `names` is a JSONB array,
// so the match succeeds when any element contains the term. LIKE wildcards in
// the term are escaped so it matches literally.
function nameMatches(term: string) {
	const escaped = term
		.replace(/\\/g, "\\\\")
		.replace(/%/g, "\\%")
		.replace(/_/g, "\\_");
	const pattern = `%${escaped}%`;

	return sql`exists (select 1 from jsonb_array_elements_text(${hmms.names}) as element(value) where element.value ilike ${pattern})`;
}

async function readTask(db: Db, taskId: number): Promise<Task | null> {
	const [row] = await db
		.select({
			complete: tasks.complete,
			createdAt: tasks.created_at,
			error: tasks.error,
			id: tasks.id,
			progress: tasks.progress,
			step: tasks.step,
			type: tasks.type,
		})
		.from(tasks)
		.where(eq(tasks.id, taskId));

	if (!row) {
		return null;
	}

	return {
		complete: row.complete ?? false,
		createdAt: row.createdAt,
		error: row.error,
		id: row.id,
		progress: row.progress ?? 0,
		step: row.step ?? "",
		type: row.type,
	};
}

export async function getHmmStatus(db: Db): Promise<HmmStatus> {
	const [row] = await db
		.select()
		.from(legacyHmmStatus)
		.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));

	if (!row) {
		throw new HmmStatusNotFoundError();
	}

	const task = row.task_id != null ? await readTask(db, row.task_id) : null;

	return {
		errors: row.errors ?? [],
		installed: row.installed ? { ready: Boolean(row.installed.ready) } : null,
		task,
	};
}

export async function findHmms(
	db: Db,
	{ page, perPage, term }: FindHmmsOptions,
): Promise<HmmSearchResult> {
	const notHidden = eq(hmms.hidden, false);
	const where = term ? and(notHidden, nameMatches(term)) : notHidden;

	const [totalRows, foundRows, rows, status] = await Promise.all([
		db.select({ value: count() }).from(hmms).where(notHidden),
		db.select({ value: count() }).from(hmms).where(where),
		db
			.select()
			.from(hmms)
			.where(where)
			.orderBy(asc(hmms.cluster), asc(hmms.id))
			.offset((page - 1) * perPage)
			.limit(perPage),
		getHmmStatus(db),
	]);

	const foundCount = takeFirstOrThrow(foundRows).value;

	return {
		items: rows.map(hmmMinimal),
		foundCount,
		page,
		pageCount: foundCount ? Math.ceil(foundCount / perPage) : 0,
		perPage,
		status,
		totalCount: takeFirstOrThrow(totalRows).value,
	};
}

export async function getHmm(db: Db, hmmId: number): Promise<Hmm> {
	const [row] = await db.select().from(hmms).where(eq(hmms.id, hmmId));

	if (!row) {
		throw new HmmNotFoundError();
	}

	return {
		...hmmMinimal(row),
		entries: row.entries,
		genera: row.genera,
		length: row.length,
		meanEntropy: row.mean_entropy,
		totalEntropy: row.total_entropy,
	};
}

/**
 * True when there is an update that has not finished installing.
 *
 * Pass `{ lock: true }` inside a transaction to take a `FOR UPDATE` row lock, so
 * a concurrent install serialises behind this read instead of racing the guard.
 */
export async function isInstallInProgress(
	db: DbOrTx,
	options: { lock?: boolean } = {},
): Promise<boolean> {
	const query = db
		.select({ updates: legacyHmmStatus.updates })
		.from(legacyHmmStatus)
		.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));

	const [row] = await (options.lock ? query.for("update") : query);

	return Boolean(row?.updates?.some((update) => !update.ready));
}

// Mirrors the GitHub releases API payload shape, so it stays snake_case
// rather than following this domain's camelCase convention.
type ManifestRelease = {
	body: string;
	content_type: string;
	download_url: string;
	filename: string;
	html_url: string;
	id: number;
	name: string;
	published_at: string;
	size: number;
};

// Compare two `vX.Y.Z` release names numerically, mirroring the semver ordering
// Python applies with `VersionInfo.parse`. Missing components sort as 0.
function isNewer(candidate: string, current: string): boolean {
	const parse = (name: string) =>
		name
			.replace(/^v/, "")
			.split(".")
			.map((part) => Number.parseInt(part, 10) || 0);

	const a = parse(candidate);
	const b = parse(current);

	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const left = a[i] ?? 0;
		const right = b[i] ?? 0;
		if (left !== right) {
			return left > right;
		}
	}

	return false;
}

// Mirror of the Python `format_hmm_release`: a release is "newer" when there is
// no stored release or nothing installed, or when it outranks the installed one.
function formatRelease(
	updated: ManifestRelease,
	release: HmmRelease | null,
	installed: HmmUpdate | null,
): Omit<HmmRelease, "retrieved_at"> {
	return {
		id: updated.id,
		name: updated.name,
		body: updated.body,
		filename: updated.filename,
		size: updated.size,
		html_url: updated.html_url,
		download_url: updated.download_url,
		published_at: updated.published_at,
		content_type: updated.content_type,
		newer:
			release == null ||
			installed == null ||
			isNewer(updated.name, installed.name),
	};
}

/**
 * Read the newest release from the www.virtool.ca manifest.
 *
 * Returns `null` when the manifest names no HMM release at all, which is the
 * only way this can succeed without one.
 *
 * **Do not add a `304` branch.** Nothing here sends `If-None-Match` or
 * `If-Modified-Since`, so the server has nothing to compare against and cannot
 * answer `304`. Python carries such a branch and it has never been reachable
 * either; a conditional request would need an ETag stored on the status row,
 * and `legacy_hmm_status` has no column for one.
 */
async function fetchManifestRelease(
	signal?: AbortSignal,
): Promise<ManifestRelease | null> {
	let response: Response;
	try {
		response = await fetch(MANIFEST_URL, {
			signal: signal
				? AbortSignal.any([signal, AbortSignal.timeout(MANIFEST_TIMEOUT_MS)])
				: AbortSignal.timeout(MANIFEST_TIMEOUT_MS),
		});
	} catch (err) {
		// The caller's signal is a shutdown or a fence, not a fault of
		// virtool.ca's. It escapes untranslated so the caller can tell the two
		// apart and leave the status row alone.
		if (signal?.aborted) {
			throw err;
		}

		// The deadline lands here too, and means the same thing to the caller as a
		// refused connection: virtool.ca did not answer.
		throw new HmmReleaseError("Could not reach Virtool.ca");
	}

	if (response.status === 404) {
		throw new HmmReleaseError("Release does not exist");
	}

	// Any other refusal is virtool.ca's, not a manifest that is missing. Reporting
	// a 503 as a release that does not exist sends whoever reads it on the HMM
	// page looking for a release that is in fact sitting there.
	if (response.status !== 200) {
		throw new HmmReleaseError(`Virtool.ca answered ${response.status}`);
	}

	const manifest = (await response.json()) as {
		"virtool-hmm"?: ManifestRelease[];
	} | null;

	const releases = manifest?.["virtool-hmm"];

	return releases?.[0] ?? null;
}

async function upsertStatus(
	db: DbOrTx,
	values: {
		errors: string[];
		installed: HmmUpdate | null;
		release: HmmRelease | null;
	},
): Promise<void> {
	await db
		.insert(legacyHmmStatus)
		.values({ id: HMM_STATUS_ID, updates: [], ...values })
		.onConflictDoUpdate({
			target: legacyHmmStatus.id,
			set: values,
		});
}

/**
 * Refresh the stored HMM release from the www.virtool.ca manifest and return it.
 *
 * Mirrors the Python `fetch_and_update_release`: the latest manifest entry
 * replaces the stored release, `retrieved_at` is stamped, and the status
 * singleton is upserted.
 *
 * **A fetch failure records the message on the status row and rethrows**, which
 * Python does not do. Its handler builds `errors` by substring-matching the
 * exception's `str()` against `"ClientConnectorError"` and `"404"`, neither of
 * which any exception it catches ever contains — so `errors` is always `[]`,
 * the `raise` that guards on it is unreachable, and a refresh that reached
 * nothing finishes as a success. Deciding between a stale release and a current
 * one is the whole point of the call, so failing is the honest outcome: the
 * caller sees the error, the row carries it on `errors`, and a task running
 * this is recorded failed rather than complete.
 *
 * Nothing renders `errors` today — `HmmInstall` reads the status row for its
 * task's progress and step alone. It is recorded because the row is what the
 * next reader has, not because a page is showing it.
 *
 * `signal` aborts the manifest fetch. A caller running under a lease passes the
 * one it was given: `fetch` would otherwise run its own deadline out with the
 * claim already released, and reach the upsert below on behalf of a runner that
 * no longer owns the work. An abort from it is rethrown untouched and writes
 * nothing — the release is neither stale nor unreachable, the process is going
 * away.
 */
export async function fetchAndUpdateRelease(
	db: DbOrTx,
	signal?: AbortSignal,
): Promise<HmmRelease | null> {
	const [status] = await db
		.select()
		.from(legacyHmmStatus)
		.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));

	let release = status?.release ?? null;
	const installed = status?.installed ?? null;

	let updated: ManifestRelease | null;
	try {
		updated = await fetchManifestRelease(signal);
	} catch (err) {
		if (signal?.aborted) {
			throw err;
		}

		const errors = err instanceof HmmReleaseError ? [err.message] : [];
		await upsertStatus(db, { errors, installed, release });
		throw err;
	}

	if (updated) {
		release = {
			...formatRelease(updated, release, installed),
			retrieved_at: "",
		};
	}

	if (release) {
		release = { ...release, retrieved_at: new Date().toISOString() };
	}

	await upsertStatus(db, { errors: [], installed, release });

	return release;
}

// Mirror of the Python `create_update_subdocument`: strip the transport-only
// fields off the release and stamp the install metadata.
//
// Python strips four fields where this strips three. `etag` is absent from
// `HmmRelease` altogether, so the two lists agree in effect.
function createUpdateSubdocument(
	release: HmmRelease,
	ready: boolean,
	userId: number,
): HmmUpdate {
	const { content_type, download_url, retrieved_at, ...rest } = release;

	return {
		...rest,
		created_at: new Date().toISOString(),
		ready,
		user: { id: userId },
	};
}

/**
 * Point the status singleton at the new task and append the pending update.
 *
 * Returns the appended update subdocument so the caller can build the install
 * response.
 */
export async function attachInstallTask(
	db: DbOrTx,
	taskId: number,
	release: HmmRelease,
	userId: number,
): Promise<HmmUpdate> {
	const update = createUpdateSubdocument(release, false, userId);

	const [row] = await db
		.select({ updates: legacyHmmStatus.updates })
		.from(legacyHmmStatus)
		.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));

	await db
		.update(legacyHmmStatus)
		.set({ task_id: taskId, updates: [...(row?.updates ?? []), update] })
		.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));

	return update;
}

/** Read a user's handle for attaching to an install response. */
export async function getUserHandle(db: Db, userId: number): Promise<string> {
	const [row] = await db
		.select({ handle: users.handle })
		.from(users)
		.where(eq(users.id, userId));

	return row?.handle ?? "";
}

/** What {@link installHmms} needs to install a release. */
export type InstallHmmsValues = {
	annotations: HmmAnnotation[];
	/**
	 * Opens the profiles database for streaming to object storage.
	 *
	 * A factory rather than the stream itself, because the idempotency
	 * short-circuit below never writes: handed a live stream, a re-run that
	 * short-circuits would leave the file handle behind it open.
	 */
	profiles: () => AsyncIterable<Uint8Array>;
	release: HmmRelease;
	userId: number;
};

/**
 * How many `hmms` rows are inserted per statement.
 *
 * Python adds one row at a time through the session. Nothing about a release
 * makes that necessary, and a real one runs to tens of thousands of
 * annotations.
 */
const ANNOTATION_INSERT_BATCH = 500;

/**
 * Whether an update subdocument describes `releaseId`.
 *
 * Compared as strings. `HmmRelease.id` is typed `number` and the manifest
 * serves one, but Python guards the same comparison with an
 * `int()`-and-`except TypeError` because an entry migrated from Mongo can carry
 * the id as a string. Getting this wrong is silent in the worst way: the
 * install writes every row and every byte, finds no matching entry, and never
 * flips `ready` — which wedges `isInstallInProgress` on and refuses every
 * install after it.
 */
function updateMatchesRelease(update: HmmUpdate, releaseId: number): boolean {
	return String(update.id) === String(releaseId);
}

/**
 * Install an HMM release: its annotations as rows, its profiles as a blob.
 *
 * The port of Python's `HmmsData.install`. Returns `false` when the status
 * singleton already records this release as installed and the call did
 * nothing.
 *
 * **The ordering inside the transaction is load-bearing.** The profiles write
 * happens inside it, immediately before the commit, and `wroteProfiles` gates
 * the delete that follows a failure. `write` is not atomic from a caller's
 * perspective — a failure can leave an incomplete multipart upload on S3 — and
 * a commit-time failure rolls Postgres back while leaving a fully written blob
 * orphaned ahead of it. The gate is what stops a failure *before* the write
 * deleting the **previous** install's profiles, which is the only copy the
 * server has. A refactor that hoists the delete out of the flag destroys that
 * copy on an unrelated failure, and nothing about the code shape would say so.
 *
 * **It does not truncate, upsert or deduplicate**, so installing a second
 * release appends a second complete set of rows, exactly as Python does.
 * `analyses.results` references `hmms.id` values, and reclaiming the old rows
 * would orphan every historical analysis's annotations — which is also what
 * `hmms.legacy_id` exists for. Whether that history has to be preserved, and
 * what an install would have to do to reclaim the old rows safely, is an open
 * question; do not answer it with an upsert here.
 */
export async function installHmms(
	db: Db,
	storage: StorageBackend,
	logger: Logger,
	{ annotations, profiles, release, userId }: InstallHmmsValues,
	onProgress?: (percent: number) => Promise<void>,
): Promise<boolean> {
	const releaseId = release.id;
	const installed = createUpdateSubdocument(release, true, userId);

	let wroteProfiles = false;
	let performed = false;

	try {
		await db.transaction(async (tx) => {
			const [status] = await tx
				.select()
				.from(legacyHmmStatus)
				.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));

			const updates = status?.updates ?? [];

			/*
			 * A lease that expires is reclaimed, and the body restarts from step
			 * zero with everything the previous attempt committed still in place —
			 * so without this a reclaim appends a second full set of rows. Keyed on
			 * the release this task row's own payload names, it can only ever
			 * suppress a repeat of this install and never collapses two distinct
			 * releases into one.
			 */
			if (
				updates.some(
					(update) => updateMatchesRelease(update, releaseId) && update.ready,
				)
			) {
				return;
			}

			performed = true;

			for (
				let start = 0;
				start < annotations.length;
				start += ANNOTATION_INSERT_BATCH
			) {
				const batch = annotations.slice(start, start + ANNOTATION_INSERT_BATCH);

				await tx.insert(hmms).values(
					batch.map((annotation) => ({
						cluster: annotation.cluster,
						count: annotation.count,
						entries: annotation.entries,
						families: annotation.families,
						genera: annotation.genera,
						// Passed explicitly, as Python does. The column's
						// `.$defaultFn` agrees, so this is belt and braces.
						hidden: false,
						length: annotation.length,
						mean_entropy: annotation.mean_entropy,
						names: annotation.names,
						total_entropy: annotation.total_entropy,
					})),
				);

				// Guarded rather than divided blind. Python's
				// `AccumulatingProgressHandlerWrapper` divides by the total with no
				// check, so a release carrying an empty array is a ZeroDivisionError.
				if (annotations.length > 0) {
					await onProgress?.(
						((start + batch.length) / annotations.length) * 100,
					);
				}

				// The runner's heartbeat shares this event loop. A long insert loop
				// that never yields starves it, and the task is reclaimed out from
				// under itself.
				await setImmediate();
			}

			/*
			 * Python records nothing at all when the singleton carries no entry for
			 * this release — no `installed`, no flipped flag — and this matches it.
			 * The rows and the profiles are still written; only the status is left
			 * alone.
			 */
			if (updates.some((update) => updateMatchesRelease(update, releaseId))) {
				await tx
					.update(legacyHmmStatus)
					.set({
						installed,
						updates: updates.map((update) =>
							updateMatchesRelease(update, releaseId)
								? { ...update, ready: true }
								: update,
						),
					})
					.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));
			}

			wroteProfiles = true;
			await storage.write(HMM_PROFILES_KEY, profiles());
		});
	} catch (err) {
		if (wroteProfiles) {
			await storage.delete(HMM_PROFILES_KEY);
		}

		throw err;
	}

	/*
	 * Attempted on the short-circuit path too. A reclaimed re-run whose install
	 * already committed is the one case where the rows are right and the blob
	 * may not be, so the repair has to happen on the path that skips everything
	 * else.
	 */
	try {
		await writeHmmAnnotations(db, storage);
	} catch (err) {
		/*
		 * Logged rather than thrown. The install itself committed — every row and
		 * every profile byte is in place — and failing the task here would run
		 * `cleanHmmStatus` and erase the record of a successful install over a
		 * cache artifact that regenerates. The key is dropped so nothing stale
		 * survives, which puts the store back in exactly the state Python's
		 * install leaves it in, with its lazy rebuild as the fallback.
		 */
		logger.warn(
			{ err, release_id: releaseId },
			"could not write the HMM annotations blob after installing",
		);

		await storage.delete(HMM_ANNOTATIONS_KEY);
	}

	return performed;
}

/**
 * Rebuild `hmm/annotations.json.gz` from the installed rows.
 *
 * **Python does not do this.** Its install *deletes* the key and
 * `HmmsData.download_annotations` regenerates it on the next request, so the
 * blob is cold from the moment an install commits until someone asks for it.
 * NuVs reads it straight out of the bucket with no route to warm it, and fails
 * by name when it is absent — so a run scheduled against a freshly installed
 * dataset fails for no reason a user could act on. Writing it here closes that
 * window.
 *
 * Called **after** the install transaction commits, never inside it. Generating
 * any earlier would read the rows the install replaced and pair a stale blob
 * with fresh profiles, and a write inside the `wroteProfiles` window would put
 * a failure here in a position to delete the profiles of an install that
 * already committed.
 *
 * The rows are paged and serialized straight into a `createGzip()` stream: a
 * real dataset is tens of thousands of annotations, and Python's
 * `json.dumps(...).encode()` holds all of it plus its gzip in memory at once.
 */
export async function writeHmmAnnotations(
	db: Db,
	storage: StorageBackend,
): Promise<void> {
	async function* iterJson(): AsyncGenerator<string> {
		yield "[";

		let lastId = 0;
		let first = true;

		for (;;) {
			const rows = await db
				.select()
				.from(hmms)
				.where(gt(hmms.id, lastId))
				.orderBy(asc(hmms.id))
				.limit(ANNOTATION_INSERT_BATCH);

			if (rows.length === 0) {
				break;
			}

			for (const row of rows) {
				// Python's `annotation_from_row`. The integer primary key is exposed
				// as `id`, which is the field NuVs maps each vFam cluster onto.
				// Annotated rather than inferred, so a column this drops or renames
				// fails here instead of in whatever reads the blob next.
				const record: HmmAnnotationRecord = {
					id: row.id,
					cluster: row.cluster,
					count: row.count,
					length: row.length,
					mean_entropy: row.mean_entropy,
					total_entropy: row.total_entropy,
					hidden: row.hidden,
					names: row.names,
					families: row.families,
					genera: row.genera,
					entries: row.entries,
				};

				yield `${first ? "" : ","}${JSON.stringify(record)}`;

				first = false;
			}

			lastId = rows[rows.length - 1]?.id ?? lastId;

			await setImmediate();
		}

		yield "]";
	}

	const source = Readable.from(iterJson(), { objectMode: false });

	// Level 6 because Python passes `compresslevel=6` explicitly. Node's default
	// happens to agree, but the two are pinned together rather than by accident.
	const gzip = createGzip({ level: 6 });

	// `pipe` does not forward a source error to its destination, so a read that
	// fails part-way would otherwise end the gzip stream cleanly and store a
	// truncated blob as though it were the whole dataset.
	source.on("error", (err) => gzip.destroy(err));
	source.pipe(gzip);

	await storage.write(HMM_ANNOTATIONS_KEY, gzip);
}

/**
 * Clear the status singleton's install record.
 *
 * The port of Python's `clean_status`, run when an install **fails**. It is
 * also the only thing that unwedges the install button afterwards, because
 * `isInstallInProgress` reads the pending entry this removes.
 *
 * **It sets `installed` to null unconditionally**, so a failed install of
 * release N erases the record of a successfully installed release N-1 whose
 * rows and profiles are untouched and still usable. That is Python's
 * behaviour and it is preserved deliberately, because both runners write this
 * row until the cutover completes. Clearing only the failed release's pending
 * entry is the obvious repair, but it has to keep clearing enough for
 * `isInstallInProgress` to go false — that is the only thing that unwedges the
 * install button after a failure.
 */
export async function cleanHmmStatus(db: DbOrTx): Promise<void> {
	await db
		.update(legacyHmmStatus)
		.set({ installed: null, task_id: null, updates: [] })
		.where(eq(legacyHmmStatus.id, HMM_STATUS_ID));
}
