import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import { toScientificNotation } from "@app/format";
import Checkbox from "@base/Checkbox";
import type { PathoscopeHit } from "@virtool/contracts";
import type { MouseEvent } from "react";

type PathoscopeTableProps = {
	/** The hits to show, in display order */
	hits: PathoscopeHit[];

	/** Whether a hit is selected */
	isSelected: (hit: PathoscopeHit) => boolean;

	/** The total number of reads mapped to any OTU during the analysis */
	mappedCount: number;

	/** Callback to handle hit selection, receiving the checkbox click event */
	onSelect: (hit: PathoscopeHit, event: MouseEvent<HTMLButtonElement>) => void;
};

/**
 * The pathoscope hits as a plain table of figures, with no coverage charts.
 *
 * The columns and their formatting match the copied table and the export, so
 * the three cannot disagree.
 */
export default function PathoscopeTable({
	hits,
	isSelected,
	mappedCount,
	onSelect,
}: PathoscopeTableProps) {
	const { search } = useAnalysisSearch();
	const showReads = search.reads ?? false;

	return (
		<table className="w-full border border-gray-300 border-collapse bg-white text-sm">
			<caption className="sr-only">Pathoscope hits</caption>
			<thead>
				<tr className="bg-gray-50 text-gray-600">
					<th className="w-14 p-2">
						<span className="sr-only">Selected</span>
					</th>
					<th className="p-2 text-left font-medium">Name</th>
					<th className="p-2 text-left font-medium">Abbreviation</th>
					<th className="p-2 text-right font-medium">
						{showReads ? "Reads" : "Weight"}
					</th>
					<th className="p-2 text-right font-medium">Depth</th>
					<th className="p-2 text-right font-medium">Coverage</th>
				</tr>
			</thead>
			<tbody>
				{hits.map((hit) => (
					<tr className="border-t border-gray-200" key={hit.id}>
						<td className="p-2 text-center">
							<Checkbox
								ariaLabel={`Select ${hit.name}`}
								checked={isSelected(hit)}
								id={`PathoscopeTableCheckbox${hit.id}`}
								onClick={(event) => onSelect(hit, event)}
							/>
						</td>
						<td className="p-2 font-medium">{hit.name}</td>
						<td className="p-2 text-gray-600">{hit.abbreviation}</td>
						<td className="p-2 text-right tabular-nums">
							{showReads
								? Math.round(hit.pi * mappedCount)
								: toScientificNotation(hit.pi)}
						</td>
						<td className="p-2 text-right tabular-nums">{hit.depth}</td>
						<td className="p-2 text-right tabular-nums">
							{hit.coverage.toFixed(3)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
