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
			{/* The checkbox is a sibling of the trigger and content rather than a
			    child of either: the trigger is a button, and a checkbox nested
			    inside one is neither valid markup nor reachable with a keyboard.
			    Keeping it a sibling of both, rather than just the trigger, holds it
			    at the left of the row whether the item is collapsed or expanded,
			    and lets the trigger and content share one column so their charts'
			    left edges land at the same padding. */}
			<div className="flex items-stretch bg-white">
				<div className="flex items-start pl-4 pt-2.5">
					<Checkbox
						ariaLabel={`Select ${name}`}
						checked={checked}
						id={`PathoscopeCheckbox${id}`}
						onClick={onSelect}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<AccordionTrigger className="flex-col items-stretch gap-4 w-full">
						{/* Everything in here is phrasing content: the trigger is a button,
						    which may not contain a `div`. The abbreviation is a column of
						    its own rather than a second line under the name, so it reads
						    across with the figures beside it; an OTU without one leaves the
						    column out entirely, and the figures stay put because the row is
						    aligned from the right. */}
						<span className="flex gap-4 items-start justify-between w-full">
							<span className="font-medium min-w-0 text-lg truncate">
								{name}
							</span>
							<span className="flex gap-4 shrink-0">
								{abbreviation && (
									<AnalysisValue
										className="w-32"
										color="gray"
										label="ABBREVIATION"
										value={abbreviation}
									/>
								)}
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
							</span>
						</span>

						<PathoscopeOtuCoverage maxDepth={maxDepth} segments={segments} />
					</AccordionTrigger>
					<AccordionContent>
						<PathoscopeDetail hit={hit} mappedCount={mappedCount} />
					</AccordionContent>
				</div>
			</div>
		</AccordionScrollingItem>
	);
}
