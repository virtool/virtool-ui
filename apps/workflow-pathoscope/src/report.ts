/**
 * Reshaping the EM output into the per-sequence report the analysis is built
 * from.
 *
 * The port of Python's `write_report`, minus the writing. Python also emitted a
 * `report.tsv` and uploaded it as the analysis's one retained file; nothing ever
 * read it back — every figure in it is in the `results` blob the same function
 * returns, and that blob is what the server formats and the SPA renders. So this
 * side writes no file at all, which is why `FinalizeAnalysisRequest.files` is
 * allowed to be empty and pathoscope is the reason it is.
 *
 * The EM core hands back eleven parallel arrays plus `refs`. They are zipped into
 * rows, sorted, cut off at the first uninteresting row, and turned into one
 * entry per surviving reference.
 */

import type { PathoscopeEmResults } from "./pathoscopeCore";

/**
 * The decimal places every float in the report is rounded to.
 *
 * A storage choice, not a compatibility one. These are proportions and scores
 * out of a floating-point accumulation, so the digits past here are arithmetic
 * noise and keeping them only makes the JSONB blob larger. Ties at the tenth
 * place round however `toFixed` rounds them — Python's `round` breaks them to
 * even and this does not, and nothing depends on which.
 */
const PLACES = 10;

/** Round for storage. See {@link PLACES}. */
function round(value: number): number {
	return Number(value.toFixed(PLACES));
}

/**
 * The cutoff below which a reference is uninteresting, if it also has no
 * confident hits either way.
 */
const PI_CUTOFF = 0.01;

/** One reference's figures, before and after reassignment. */
export type ReportEntryLevel = {
	/** The proportion of reads from the entire sample matching this reference */
	pi: number;

	/** The best alignment score recorded against the reference */
	best: number;

	/** High-confidence hits */
	high: number;

	/** Low-confidence hits */
	low: number;

	/** The number of reads assigned to this reference */
	reads: number;
};

/** One reference's entry in the report, keyed by its sequence id. */
export type ReportEntry = {
	/** Figures after expectation maximization reassigned the multi-mapping reads */
	final: ReportEntryLevel;

	/** Figures from the initial assignment, before reassignment */
	initial: ReportEntryLevel;
};

/** One reference's figures, gathered from the eleven parallel arrays. */
type Row = {
	pi: number;
	ref: string;
	initPi: number;
	bestHitInitial: number;
	bestHitInitialReads: number;
	bestHitFinal: number;
	bestHitFinalReads: number;
	level1Initial: number;
	level2Initial: number;
	level1Final: number;
	level2Final: number;
};

/**
 * Zip the eleven parallel arrays into rows, one per reference.
 *
 * Python zips them and lets a short array truncate the result silently. Here a
 * length mismatch is an error: the arrays are positional, so one short by a
 * single element shifts every figure after it onto the wrong reference, and the
 * report would look entirely plausible.
 *
 * @throws {Error} when any array is not the same length as `refs`.
 */
function zipRows(results: PathoscopeEmResults): Row[] {
	const columns = {
		pi: results.pi,
		initPi: results.init_pi,
		bestHitInitial: results.best_hit_initial,
		bestHitInitialReads: results.best_hit_initial_reads,
		bestHitFinal: results.best_hit_final,
		bestHitFinalReads: results.best_hit_final_reads,
		level1Initial: results.level_1_initial,
		level2Initial: results.level_2_initial,
		level1Final: results.level_1_final,
		level2Final: results.level_2_final,
	} as const;

	const expected = results.refs.length;

	for (const [name, values] of Object.entries(columns)) {
		if (values.length !== expected) {
			throw new Error(
				`Expectation maximization returned ${values.length} ${name} values for ${expected} references`,
			);
		}
	}

	return results.refs.map((ref, index) => {
		const row: Row = { ref } as Row;

		for (const [name, values] of Object.entries(columns)) {
			// Checked above, so this cannot be undefined — the assertion is what
			// lets the loop stay a loop rather than eleven repeated lines.
			row[name as keyof typeof columns] = values[index] as number;
		}

		return row;
	});
}

/**
 * Order rows by share of reads, descending, breaking ties by reference id.
 *
 * The order is not cosmetic — it decides where the report is cut off, and so
 * which references reach the analysis at all.
 *
 * **The tie-break has to be on something stable.** `pi` ties routinely: a
 * segmented OTU's isolates share one, and so does every reference the EM run
 * assigned nothing to. Sorting on `pi` alone would leave those in the order the
 * EM core emitted them, which comes out of a Rust hash map and is not an order
 * at all — two runs over the same alignment could cut the report in different
 * places. The reference id is the only field here that is unique and stable, so
 * it settles it.
 *
 * Python compares the whole eleven-element tuple, falling through `pi` to `refs`
 * and then through the remaining nine floats. Those further fields are
 * unreachable once `ref` has decided it, so they are not reproduced.
 */
function compareRows(a: Row, b: Row): number {
	// Descending, so `b` before `a`.
	if (a.pi !== b.pi) {
		return b.pi - a.pi;
	}

	if (a.ref === b.ref) {
		return 0;
	}

	return a.ref < b.ref ? 1 : -1;
}

/**
 * Whether a row is past the point the report stops at.
 *
 * A reference with a negligible share of the reads and no confident hits either
 * way carries no information.
 */
function isUninteresting(row: Row): boolean {
	return row.pi < PI_CUTOFF && row.level1Final <= 0 && row.level2Final <= 0;
}

/**
 * Build the report from an EM run's results.
 *
 * @returns one entry per surviving reference, keyed by sequence id.
 */
export function buildReport(
	results: PathoscopeEmResults,
): Map<string, ReportEntry> {
	const rows = zipRows(results);

	rows.sort(compareRows);

	// The count of leading rows before the first uninteresting one — not a
	// filter. A row past the cutoff is dropped along with everything after it,
	// however interesting it looks, because the sort has already put the
	// interesting ones first.
	let end = 0;

	for (const row of rows) {
		if (isUninteresting(row)) {
			break;
		}

		end += 1;
	}

	const report = new Map<string, ReportEntry>();

	for (const row of rows.slice(0, end)) {
		report.set(row.ref, {
			final: {
				pi: round(row.pi),
				best: round(row.bestHitFinal),
				high: round(row.level1Final),
				low: round(row.level2Final),
				// The EM core types every read count as an `f64`, so it arrives
				// fractional and is truncated to a whole read.
				reads: Math.trunc(row.bestHitFinalReads),
			},
			initial: {
				pi: round(row.initPi),
				best: round(row.bestHitInitial),
				high: round(row.level1Initial),
				low: round(row.level2Initial),
				reads: Math.trunc(row.bestHitInitialReads),
			},
		});
	}

	return report;
}
