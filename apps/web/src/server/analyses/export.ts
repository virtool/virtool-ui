// Render a pathoscope analysis as a downloadable spreadsheet. Ported from
// `format_analysis_to_csv` and `format_analysis_to_excel` in
// `../../../../../virtool/virtool/analyses/format.py`.

import type { JsonObject, JsonValue } from "@virtool/contracts";
import type { DbOrTx } from "../db/pg";
import { formatAnalysis } from "./format";

const HEADERS = [
	"OTU",
	"Isolate",
	"Sequence",
	"Length",
	"Weight",
	"Median Depth",
	"Coverage",
] as const;

/** A single spreadsheet row: the OTU and isolate names, then numeric metrics. */
type Row = [string, string, string, number, number, number, number];

function asRecord(value: JsonValue | undefined): JsonObject | null {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return null;
	}

	return value;
}

function asArray(value: JsonValue | undefined): JsonValue[] {
	return Array.isArray(value) ? value : [];
}

function asNumber(value: JsonValue | undefined): number {
	return typeof value === "number" ? value : 0;
}

function asText(value: JsonValue | undefined): string {
	return typeof value === "string" ? value : "";
}

/**
 * The median of `values`, matching Python's `statistics.median`: the middle
 * value, or the mean of the two middle values for an even count. It is not
 * rounded — the client's own `median` helper is a different function.
 */
function median(values: number[]): number {
	if (values.length === 0) {
		return 0;
	}

	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 1) {
		return sorted[middle] ?? 0;
	}

	return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
}

// Median depth per hit sequence, taken from the raw alignment before formatting
// replaces it with simplified coordinates.
function calculateMedianDepths(hits: JsonValue[]): Map<string, number> {
	const depths = new Map<string, number>();

	for (const entry of hits) {
		const hit = asRecord(entry);

		if (hit) {
			depths.set(
				asText(hit.id),
				median(asArray(hit.align).filter((v) => typeof v === "number")),
			);
		}
	}

	return depths;
}

// Python's `format_isolate_name`, which differs from the client helper of the
// same name: either field being empty yields the unnamed sentinel.
function formatIsolateName(isolate: JsonObject): string {
	const sourceType = asText(isolate.source_type);
	const sourceName = asText(isolate.source_name);

	if (!sourceType || !sourceName) {
		return "Unnamed Isolate";
	}

	return `${sourceType.charAt(0).toUpperCase()}${sourceType.slice(1)} ${sourceName}`;
}

async function composeRows(
	db: DbOrTx,
	workflow: string,
	results: JsonObject,
): Promise<Row[]> {
	const depths = calculateMedianDepths(asArray(results.hits));
	// The formatter rebuilds plain objects out of JSONB values, so its output is
	// JSON by construction.
	const formatted = (await formatAnalysis(db, workflow, results)) as JsonObject;

	const rows: Row[] = [];

	for (const otuEntry of asArray(formatted.hits)) {
		const otu = asRecord(otuEntry);

		if (!otu) {
			continue;
		}

		for (const isolateEntry of asArray(otu.isolates)) {
			const isolate = asRecord(isolateEntry);

			if (!isolate) {
				continue;
			}

			for (const sequenceEntry of asArray(isolate.sequences)) {
				const sequence = asRecord(sequenceEntry);

				if (!sequence) {
					continue;
				}

				rows.push([
					asText(otu.name),
					formatIsolateName(isolate),
					asText(sequence.accession),
					asNumber(sequence.length),
					asNumber(sequence.pi),
					depths.get(asText(sequence.id)) ?? 0,
					asNumber(sequence.coverage),
				]);
			}
		}
	}

	return rows;
}

// Python writes with `csv.QUOTE_NONNUMERIC`: every non-numeric field is quoted,
// numbers are written bare, and an embedded quote is doubled.
function toCsvField(value: string | number): string {
	if (typeof value === "number") {
		return String(value);
	}

	return `"${value.replaceAll('"', '""')}"`;
}

function toCsvRow(row: readonly (string | number)[]): string {
	return row.map(toCsvField).join(",");
}

/** Render a pathoscope analysis's results as CSV. */
export async function formatAnalysisToCsv(
	db: DbOrTx,
	workflow: string,
	results: JsonObject,
): Promise<string> {
	const rows = await composeRows(db, workflow, results);

	// Python's csv writer terminates every row with CRLF, including the last.
	return `${[HEADERS, ...rows].map(toCsvRow).join("\r\n")}\r\n`;
}

/** Render a pathoscope analysis's results as an XLSX workbook. */
export async function formatAnalysisToExcel(
	db: DbOrTx,
	workflow: string,
	results: JsonObject,
	sampleId: string,
): Promise<Uint8Array<ArrayBuffer>> {
	const rows = await composeRows(db, workflow, results);

	// Imported here rather than at module scope: the workbook writer is a large
	// dependency and only the xlsx branch of one download route needs it.
	const { Workbook } = await import("exceljs");

	const workbook = new Workbook();
	const sheet = workbook.addWorksheet(`Pathoscope for ${sampleId}`);

	const header = sheet.addRow([...HEADERS]);
	header.font = { name: "Calibri", bold: true };

	for (const row of rows) {
		sheet.addRow(row);
	}

	// `writeBuffer` is typed as exceljs's own Buffer alias; the bytes are a plain
	// ArrayBuffer, which is what a Response body needs.
	return new Uint8Array((await workbook.xlsx.writeBuffer()) as ArrayBuffer);
}
