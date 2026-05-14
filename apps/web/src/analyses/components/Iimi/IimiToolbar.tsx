import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import { AnalysisViewerSort } from "@analyses/components/Viewer/Sort";
import InputSearch from "@base/InputSearch";
import InputSimple from "@base/InputSimple";
import Toolbar from "@base/Toolbar";
import numbro from "numbro";

type IimiToolbarProps = {
	minimumProbability: number;
	sortKey: string;
	term: string;
	setMinimumProbability: (value: number) => void;
	setTerm: (value: string) => void;
};

/**
 * Toolbar for filtering and sorting iimi results
 */
export default function IimiToolbar({
	minimumProbability,
	sortKey,
	term,
	setMinimumProbability,
	setTerm,
}: IimiToolbarProps) {
	const value = numbro(minimumProbability).format("0.000");
	const { setSearch } = useAnalysisSearch();

	return (
		<Toolbar>
			<InputSearch value={term} onChange={(e) => setTerm(e.target.value)} />
			<AnalysisViewerSort
				workflow="iimi"
				sortKey={sortKey}
				onSelect={(sort) => setSearch({ sort })}
			/>
			<form>
				<InputSimple
					type="number"
					max={1}
					min={0}
					onChange={(e) => setMinimumProbability(parseFloat(e.target.value))}
					step={0.005}
					value={value}
				/>
			</form>
		</Toolbar>
	);
}
