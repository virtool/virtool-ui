import { chartHeight, chartMargin } from "./columns";

type PathoscopeSequenceEmptyProps = {
	/** Whether any isolate recorded a hit against this segment */
	detected: boolean;

	/** The schema segment name, or null when the segment was inferred by length */
	name: string | null;

	/** The width of the column, which the filled columns are drawn at too */
	width: number;
};

/**
 * The column of a segment this isolate has no reads against.
 *
 * It holds the column open so the isolates above and below line up on the
 * segments they do share. An isolate missing a segment used to shift every column
 * after it along, which left the rows reading as though they were showing the
 * same segments when they were not.
 *
 * A segment no isolate was hit against says so, rather than claiming this isolate
 * does not carry it — nothing mapped to it anywhere, and the reference may well
 * describe it for every isolate.
 */
export default function PathoscopeSequenceEmpty({
	detected,
	name,
	width,
}: PathoscopeSequenceEmptyProps) {
	return (
		<div className="bg-blue-100 border border-blue-200 inline-block rounded-sm">
			<p className="font-medium m-0 p-4 text-base text-gray-600">
				{name ?? "Segment"}
			</p>
			<div
				className="flex items-center justify-center text-gray-600 text-sm"
				style={{ height: chartHeight + chartMargin, width }}
			>
				{detected ? "Not in this isolate" : "No reads mapped"}
			</div>
		</div>
	);
}
