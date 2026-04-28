import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import ButtonToggle from "@base/ButtonToggle";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
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
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					value={find}
					onChange={(e) => setSearch({ find: e.target.value })}
					placeholder="Name or family"
				/>
			</div>
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
		</Toolbar>
	);
}
