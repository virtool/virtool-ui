import { chartHeight, chartMargin } from "./columns";

type PathoscopeSequenceEmptyProps = {
	/** The schema segment name, or null when the segment was inferred by length */
	name: string | null;

	/** The width of the column, which the filled columns are drawn at too */
	width: number;
};

/**
 * The column of a segment this isolate carries no sequence for.
 *
 * It holds the column open so the isolates below and above line up on the
 * segments they do share. An isolate missing a segment used to shift every
 * column after it along, which left the rows reading as though they were
 * showing the same segments when they were not.
 */
export default function PathoscopeSequenceEmpty({
	name,
	width,
}: PathoscopeSequenceEmptyProps) {
	return (
		<div className="bg-blue-100 inline-block rounded">
			<p className="font-medium m-0 p-4 text-base text-gray-600">
				{name ?? "Segment"}
			</p>
			<div
				className="flex items-center justify-center text-gray-600 text-sm"
				style={{ height: chartHeight + chartMargin, width }}
			>
				Not in this isolate
			</div>
		</div>
	);
}
