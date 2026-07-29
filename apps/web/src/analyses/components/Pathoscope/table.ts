import { toScientificNotation } from "@app/format";
import type { PathoscopeHit } from "@virtool/contracts";

/** Options describing how a hit's weight is presented. */
type PathoscopeTableOptions = {
	/** The total number of reads mapped to any OTU during the analysis */
	mappedCount: number;

	/** Whether to render read pseudo-counts instead of weights */
	showReads: boolean;
};

/**
 * Render pathoscope hits as a tab-separated table for pasting into a
 * spreadsheet.
 *
 * The values are formatted exactly as the list shows them, so a pasted table
 * and the screen it was copied from cannot disagree. Both number formatters
 * this reaches have grouping disabled, which keeps every field parseable as a
 * number on the other side.
 */
export function formatPathoscopeHitsAsTsv(
	hits: PathoscopeHit[],
	{ mappedCount, showReads }: PathoscopeTableOptions,
): string {
	const rows = hits.map((hit) => [
		hit.name,
		showReads
			? String(Math.round(hit.pi * mappedCount))
			: toScientificNotation(hit.pi),
		String(hit.depth),
		hit.coverage.toFixed(3),
	]);

	return [
		["Name", showReads ? "Reads" : "Weight", "Depth", "Coverage"],
		...rows,
	]
		.map((row) => row.join("\t"))
		.join("\n");
}
