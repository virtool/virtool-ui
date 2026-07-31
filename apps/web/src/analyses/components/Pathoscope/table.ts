import { toScientificNotation } from "@app/format";
import type { PathoscopeHit } from "@virtool/contracts";

/** Options describing how a copied table is presented. */
type PathoscopeTableOptions = {
	/** Whether to lead with a header row */
	headers: boolean;

	/** The total number of reads mapped to any OTU during the analysis */
	mappedCount: number;

	/** Whether to render read pseudo-counts instead of weights */
	showReads: boolean;
};

// Both number formatters this reaches have grouping disabled, which keeps every
// field parseable as a number on the other side.
function formatWeight(
	pi: number,
	{ mappedCount, showReads }: PathoscopeTableOptions,
): string {
	return showReads
		? String(Math.round(pi * mappedCount))
		: toScientificNotation(pi);
}

function toTsv(header: string[], rows: string[][], headers: boolean): string {
	return (headers ? [header, ...rows] : rows)
		.map((row) => row.join("\t"))
		.join("\n");
}

/**
 * Render pathoscope hits as a tab-separated table for pasting into a
 * spreadsheet, one row per OTU.
 *
 * The values are formatted exactly as the list shows them, so a pasted table
 * and the screen it was copied from cannot disagree.
 */
export function formatPathoscopeHitsAsTsv(
	hits: PathoscopeHit[],
	options: PathoscopeTableOptions,
): string {
	const rows = hits.map((hit) => [
		hit.name,
		formatWeight(hit.pi, options),
		String(hit.depth),
		hit.coverage.toFixed(3),
	]);

	return toTsv(
		["Name", options.showReads ? "Reads" : "Weight", "Depth", "Coverage"],
		rows,
		options.headers,
	);
}

/**
 * Render pathoscope hits as a tab-separated table for pasting into a
 * spreadsheet, one row per detected isolate.
 *
 * Every isolate carries its OTU's name, so the rows stand on their own once
 * they have been sorted or filtered in the spreadsheet.
 */
export function formatPathoscopeIsolatesAsTsv(
	hits: PathoscopeHit[],
	options: PathoscopeTableOptions,
): string {
	const rows = hits.flatMap((hit) =>
		hit.isolates.map((isolate) => [
			hit.name,
			isolate.name,
			formatWeight(isolate.pi, options),
			String(isolate.depth),
			isolate.coverage.toFixed(3),
		]),
	);

	return toTsv(
		[
			"Name",
			"Isolate",
			options.showReads ? "Reads" : "Weight",
			"Depth",
			"Coverage",
		],
		rows,
		options.headers,
	);
}
