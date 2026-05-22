import { useSortAndFilterPathoscopeHits } from "@analyses/hooks";
import Accordion from "@base/Accordion";
import type { FormattedPathoscopeAnalysis } from "@/analyses/types";
import type { Sample } from "@/samples/types";
import { PathoscopeItem } from "./PathoscopeItem";

type PathoscopeListProps = {
	analysis: FormattedPathoscopeAnalysis;
	sample: Sample;
};

/** A list of Pathoscope hits. */
export function PathoscopeList({ analysis, sample }: PathoscopeListProps) {
	return (
		<Accordion type="single" collapsible>
			{useSortAndFilterPathoscopeHits(analysis, sample.quality.length[1]).map(
				(hit) => (
					<PathoscopeItem
						key={hit.id}
						hit={hit}
						mappedCount={analysis.results.readCount}
					/>
				),
			)}
		</Accordion>
	);
}
