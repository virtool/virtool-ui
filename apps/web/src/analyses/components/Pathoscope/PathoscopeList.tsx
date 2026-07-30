import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import { useSortAndFilterPathoscopeHits } from "@analyses/hooks";
import type { FormattedPathoscopeAnalysis } from "@analyses/types";
import Accordion from "@base/Accordion";
import { useListSelection } from "@base/useListSelection";
import type { PathoscopeHit, Sample } from "@virtool/contracts";
import type { MouseEvent } from "react";
import { PathoscopeItem } from "./PathoscopeItem";
import PathoscopeListHeader from "./PathoscopeListHeader";
import PathoscopeTable from "./PathoscopeTable";
import { formatPathoscopeHitsAsTsv } from "./table";

type PathoscopeListProps = {
	analysis: FormattedPathoscopeAnalysis;
	sample: Sample;
};

/** A list of Pathoscope hits. */
export function PathoscopeList({ analysis, sample }: PathoscopeListProps) {
	const hits = useSortAndFilterPathoscopeHits(
		analysis,
		sample.quality?.length[1] ?? 0,
	);

	const { search } = useAnalysisSearch();
	const showReads = search.reads ?? false;
	const showTable = search.table ?? false;

	// Every hit is on screen at once, so a selection that outlived a filter would
	// be copied without ever being visible. The key is built from the hit ids
	// sorted, so narrowing the list clears the selection while merely re-sorting
	// it — which changes the order but not the membership — leaves it alone.
	const selection = useListSelection<PathoscopeHit>({
		getKey: (hit) => hit.id,
		resetKey: hits
			.map((hit) => hit.id)
			.sort()
			.join(","),
	});

	function selectHit(hit: PathoscopeHit, event: MouseEvent<HTMLButtonElement>) {
		selection.select(hit, {
			shiftKey: event.shiftKey,
			visibleItems: hits,
		});
	}

	// Taken from the hits rather than the selection so the pasted rows come out
	// in the order they are shown, not the order they were clicked.
	function copySelected() {
		return navigator.clipboard.writeText(
			formatPathoscopeHitsAsTsv(hits.filter(selection.isSelected), {
				mappedCount: analysis.results.readCount,
				showReads,
			}),
		);
	}

	return (
		<>
			<PathoscopeListHeader
				checked={selection.getVisibleState(hits)}
				found={hits.length}
				onCopy={copySelected}
				onSelectAll={() => selection.toggleVisible(hits)}
				selectedCount={selection.selected.length}
			/>
			{showTable ? (
				<PathoscopeTable
					hits={hits}
					isSelected={selection.isSelected}
					mappedCount={analysis.results.readCount}
					onSelect={selectHit}
				/>
			) : (
				<Accordion type="single" collapsible>
					{hits.map((hit) => (
						<PathoscopeItem
							key={hit.id}
							checked={selection.isSelected(hit)}
							hit={hit}
							mappedCount={analysis.results.readCount}
							onSelect={(event: MouseEvent<HTMLButtonElement>) =>
								selectHit(hit, event)
							}
						/>
					))}
				</Accordion>
			)}
		</>
	);
}
