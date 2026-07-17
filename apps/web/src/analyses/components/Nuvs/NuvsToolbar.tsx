import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import ButtonToggle from "@base/ButtonToggle";
import SearchToolbar from "@base/SearchToolbar";
import Tooltip from "@base/Tooltip";
import { AnalysisViewerSort } from "../Viewer/Sort";
import NuvsExport, { type NuvsExportProps } from "./NuvsExport";

/**
 * Displays a toolbar for managing and filtering Nuvs
 */
export default function NuvsToolbar({
	analysisId,
	results,
	sampleName,
}: NuvsExportProps) {
	const { search, setSearch } = useAnalysisSearch();
	const filterORFs = search.filterOrfs ?? true;
	const filterSequences = search.filterSequences ?? true;
	const find = search.find ?? "";
	const sortKey = search.sort ?? "length";

	return (
		<SearchToolbar
			aria-label="Search results"
			onChange={(find) => setSearch({ find })}
			placeholder="Name or family"
			value={find}
		>
			<AnalysisViewerSort
				workflow="nuvs"
				sortKey={sortKey}
				onSelect={(sort) => setSearch({ sort })}
			/>
			<Tooltip tip="Hide sequences that have no HMM hits">
				<ButtonToggle
					onPressedChange={(filterSequences) => setSearch({ filterSequences })}
					pressed={filterSequences}
				>
					Filter Sequences
				</ButtonToggle>
			</Tooltip>
			<Tooltip tip="Hide ORFs that have no HMM hits">
				<ButtonToggle
					pressed={filterORFs}
					onPressedChange={(filterOrfs) => setSearch({ filterOrfs })}
				>
					Filter ORFs
				</ButtonToggle>
			</Tooltip>
			<NuvsExport
				analysisId={analysisId}
				results={results}
				sampleName={sampleName}
			/>
		</SearchToolbar>
	);
}
