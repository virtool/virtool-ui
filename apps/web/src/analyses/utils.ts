import { formatIsolateName } from "@app/utils";
import { compact, uniq } from "es-toolkit/array";
import {
	flatMap,
	has,
	max,
	maxBy,
	min,
	minBy,
	reject,
	sortBy,
	sumBy,
} from "es-toolkit/compat";
import type {
	AnalysisWorkflow,
	FormattedPathoscopeAnalysis,
	FormattedPathoscopeIsolate,
	NuvsOrf,
} from "./types";

export function calculateAnnotatedOrfCount(orfs) {
	return orfs.filter((orf) => orf.hits.length).length;
}

function calculateSequenceMinimumE(orfs: NuvsOrf[]) {
	if (orfs.length) {
		return min(
			orfs.map((orf) =>
				orf.hits.length ? (minBy(orf.hits, "full_e")?.full_e ?? 0) : 0,
			),
		);
	}
}

export function extractFamilies(orfs) {
	const families = uniq(
		flatMap(orfs, (orf) =>
			flatMap(orf.hits, (hit) => Object.keys(hit.families)),
		),
	);
	return reject(families, (f) => f === "None");
}

export function extractNames(orfs) {
	return uniq(flatMap(orfs, (orf) => flatMap(orf.hits, (hit) => hit.names)));
}

type FillAlignParams = {
	align?: number[][];
	length: number;
};

/**
 * Transform an array of coordinate pairs into an flat array where the index is the x coordinate and the value is the y
 * coordinate.
 *
 * @param {Array} align - the coordinates
 * @param length - the length of the generated flat array
 */
export function fillAlign({ align, length }: FillAlignParams) {
	if (!align) {
		return Array(length).fill(0);
	}

	const coords = Object.fromEntries(align);

	let prev = 0;

	return Array.from({ length }, (_, i) => {
		if (has(coords, i)) {
			prev = coords[i];
		}

		return prev;
	});
}

export function formatNuvsData(detail) {
	if (detail.results === null) {
		return detail;
	}

	const hits = detail.results.hits.map((hit) => ({
		...hit,
		id: Number(hit.index),
		annotatedOrfCount: calculateAnnotatedOrfCount(hit.orfs),
		e: calculateSequenceMinimumE(hit.orfs),
		families: extractFamilies(hit.orfs),
		names: extractNames(hit.orfs),
	}));

	const longestSequence = hits.reduce((longest, hit) =>
		hit.sequence.length > (longest?.sequence?.length ?? 0) ? hit : longest,
	);

	const { created_at, id, ready, user, workflow } = detail;

	return {
		created_at,
		id,
		ready,
		results: {
			...detail.results,
			hits,
		},
		user,
		workflow,
		maxSequenceLength: longestSequence.sequence.length,
	};
}

/**
 * Calculate the median of an Array of numbers.
 *
 * @param values - an array of numbers
 */
export function median(values: number[]): number {
	if (values.length === 0) {
		return 0;
	}

	const sorted = values.slice().sort((a, b) => a - b);

	const midIndex = (sorted.length - 1) / 2;

	if (midIndex % 1 === 0) {
		// midIndex is an in-range integer index because the array is non-empty.
		return sorted[midIndex] ?? 0;
	}

	// floor and ceil of midIndex are both in-range indices of the non-empty array.
	const lower = sorted[Math.floor(midIndex)] ?? 0;
	const upper = sorted[Math.ceil(midIndex)] ?? 0;

	return Math.round((lower + upper) / 2);
}

/**
 * Merge the coverage arrays for the given isolates.
 *
 * This is used to render a representative coverage chart for the parent OTU.
 */
export function mergeCoverage(
	isolates: Pick<FormattedPathoscopeIsolate, "filled">[],
): number[] {
	const longest = maxBy(isolates, (isolate) => isolate.filled.length);
	if (!longest) {
		return [];
	}
	const coverages = isolates.map((isolate) => isolate.filled);

	return longest.filled.map(
		(_depth, index) => max(coverages.map((coverage) => coverage[index])) ?? 0,
	);
}

export function formatSequence(sequence, readCount) {
	return {
		...sequence,
		filled: fillAlign(sequence),
		reads: sequence.pi * readCount,
	};
}

export function formatPathoscopeData(detail): FormattedPathoscopeAnalysis {
	if (detail.results === null || detail.results.hits.length === 0) {
		return detail;
	}

	const {
		created_at,
		results,
		id,
		index,
		ready,
		reference,
		subtractions,
		user,
		workflow,
	} = detail;

	const readCount = results.read_count;

	const hits = results.hits.map((otu) => {
		// Go through each isolate associated with the OTU, adding properties for weight, read count,
		// median depth, and coverage. These values will be calculated from the sequences owned by each isolate.
		const isolateNames: string[] = [];
		const isolates = otu.isolates.map((isolate) => {
			// Make a name for the isolate by joining the source type and name, eg. "Isolate" + "Q47".
			const name = formatIsolateName(isolate);

			isolateNames.push(name);

			const sequences = sortBy(
				isolate.sequences.map((sequence) =>
					formatSequence(sequence, readCount),
				),
				"length",
			);

			const filled = sequences.flatMap((seq) => seq.filled);

			// Coverage is the number of non-zero depth positions divided by the total number of positions.
			const coverage =
				filled.length === 0 ? 0 : compact(filled).length / filled.length;

			return {
				...isolate,
				name,
				filled,
				coverage,
				sequences,
				maxDepth: max(filled),
				pi: sumBy(sequences, (seq) => seq.pi),
				depth: median(filled),
			};
		});

		const filled = mergeCoverage(isolates);
		const pi = isolates.reduce((sum, isolate) => sum + isolate.pi, 0);

		const maxCoverageIsolate = isolates.reduce((maxIsolate, isolate) =>
			isolate.coverage > maxIsolate.coverage ? isolate : maxIsolate,
		);
		const maxFilledLengthIsolate = isolates.reduce((maxIsolate, isolate) =>
			isolate.filled.length > maxIsolate.filled.length ? isolate : maxIsolate,
		);
		const maxDepthIsolate = isolates.reduce((maxIsolate, isolate) =>
			isolate.maxDepth > maxIsolate.maxDepth ? isolate : maxIsolate,
		);

		return {
			...otu,
			filled,
			pi,
			isolates: sortBy(isolates, (i) => i.coverage).reverse(),
			coverage: maxCoverageIsolate.coverage,
			depth: median(filled),
			isolateNames: reject(
				uniq(isolateNames),
				(name) => name === "Unnamed Isolate",
			),
			maxGenomeLength: maxFilledLengthIsolate.filled.length,
			maxDepth: maxDepthIsolate.maxDepth,
			reads: pi * readCount,
		};
	});

	return {
		...detail,
		created_at,
		id,
		index,
		reference,
		ready,
		results: {
			hits,
			readCount,
			subtractedCount: detail.results.subtracted_count,
		},
		subtractions,
		user,
		workflow,
	};
}

export function formatData(detail) {
	if (detail?.workflow === "pathoscope") {
		return formatPathoscopeData(detail);
	}

	if (detail?.workflow === "nuvs") {
		return formatNuvsData(detail);
	}

	return detail;
}

const supportedWorkflows: AnalysisWorkflow[] = ["pathoscope", "nuvs"];

export function checkSupportedWorkflow(workflow) {
	return supportedWorkflows.includes(workflow);
}
