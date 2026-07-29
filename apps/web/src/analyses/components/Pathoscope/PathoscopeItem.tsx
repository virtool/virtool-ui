import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import AnalysisValue from "@analyses/components/AnalysisValue";
import { toScientificNotation } from "@app/format";
import AccordionContent from "@base/AccordionContent";
import AccordionScrollingItem from "@base/AccordionScrollingItem";
import AccordionTrigger from "@base/AccordionTrigger";
import Checkbox from "@base/Checkbox";
import type { PathoscopeHit } from "@virtool/contracts";
import type { MouseEvent } from "react";
import PathoscopeDetail from "./PathoscopeDetail";
import PathoscopeOtuCoverage from "./PathoscopeOtuCoverage";

type PathoscopeItemProps = {
	/** Whether the hit is selected */
	checked: boolean;

	/** Complete information for a pathoscope hit */
	hit: PathoscopeHit;

	/** The total number of reads mapped to any OTU during the analysis*/
	mappedCount: number;

	/** Callback to handle hit selection, receiving the checkbox click event */
	onSelect: (event: MouseEvent<HTMLButtonElement>) => void;
};

/** Results for a single pathoscope analysis hit  */
export function PathoscopeItem({
	checked,
	mappedCount,
	hit,
	onSelect,
}: PathoscopeItemProps) {
	const { abbreviation, coverage, depth, maxDepth, name, pi, id, segments } =
		hit;
	const { search } = useAnalysisSearch();
	const showReads = search.reads ?? false;

	const piValue = showReads
		? Math.round(pi * mappedCount)
		: toScientificNotation(pi);

	return (
		<AccordionScrollingItem value={id}>
			{/* The checkbox is a sibling of the trigger rather than a child: the
			    trigger is a button, and a checkbox nested inside one is neither
			    valid markup nor reachable with a keyboard. */}
			<div className="flex items-stretch bg-white">
				<div className="flex items-center pl-4">
					<Checkbox
						ariaLabel={`Select ${name}`}
						checked={checked}
						id={`PathoscopeCheckbox${id}`}
						onClick={onSelect}
					/>
				</div>
				<AccordionTrigger className="flex-1 flex-col items-stretch gap-4 min-w-0">
					<div className="flex justify-between">
						<header className="flex flex-col font-medium items-start text-lg">
							<span className="mb-0.5">{name}</span>
							<span className="text-gray-500">
								{abbreviation || "No Abbreviation"}
							</span>
						</header>
						<div className="flex gap-4">
							<AnalysisValue
								color="green"
								label={showReads ? "READS" : "WEIGHT"}
								value={piValue}
							/>
							<AnalysisValue color="red" label="DEPTH" value={depth} />
							<AnalysisValue
								color="blue"
								label="COVERAGE"
								value={coverage.toFixed(3)}
							/>
						</div>
					</div>

					<PathoscopeOtuCoverage maxDepth={maxDepth} segments={segments} />
				</AccordionTrigger>
			</div>
			<AccordionContent>
				<PathoscopeDetail hit={hit} mappedCount={mappedCount} />
			</AccordionContent>
		</AccordionScrollingItem>
	);
}
