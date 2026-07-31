import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import type { FormattedPathoscopeAnalysis } from "@analyses/types";
import Button from "@base/Button";
import ButtonGroup from "@base/ButtonGroup";
import ButtonToggle from "@base/ButtonToggle";
import Icon from "@base/Icon";
import SearchToolbar from "@base/SearchToolbar";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";
import Tooltip from "@base/Tooltip";
import {
	ArrowDownAZ,
	ArrowDownWideNarrow,
	ArrowUpAZ,
	ArrowUpWideNarrow,
	ChartArea,
	Hash,
	Table,
} from "lucide-react";
import { AnalysisViewerSort } from "../Viewer/Sort";
import { collapsingLabel } from "./collapsingLabel";
import PathoscopeExport from "./PathoscopeExport";
import PathoscopeFilter from "./PathoscopeFilter";

type PathoscopeToolbarProps = {
	/** The analysis being viewed */
	analysis: FormattedPathoscopeAnalysis;
};

/** A selection of filters and toggles for pathoscope data presentation */
export function PathoscopeToolbar({ analysis }: PathoscopeToolbarProps) {
	const { search, setSearch } = useAnalysisSearch();
	const find = search.find ?? "";
	const showReads = search.reads ?? false;
	const sortKey = search.sortKey ?? "coverage";
	const sortDirection = search.sortDirection ?? "desc";
	const showTable = search.table ?? false;

	// The wide-to-narrow arrows read as magnitude, which a name sort is not.
	const directionIcons =
		sortKey === "name"
			? { asc: ArrowUpAZ, desc: ArrowDownAZ }
			: { asc: ArrowUpWideNarrow, desc: ArrowDownWideNarrow };

	return (
		<SearchToolbar
			aria-label="Search results"
			onChange={(find) => setSearch({ find })}
			value={find}
		>
			<ButtonGroup>
				<AnalysisViewerSort
					workflow="pathoscope"
					sortKey={sortKey}
					onSelect={(sortKey) => setSearch({ sortKey })}
				/>
				<Button
					aria-label={
						sortDirection === "desc" ? "Sort ascending" : "Sort descending"
					}
					onClick={() =>
						setSearch({
							sortDirection: sortDirection === "desc" ? "asc" : "desc",
						})
					}
				>
					<Icon
						icon={
							sortDirection === "desc"
								? directionIcons.desc
								: directionIcons.asc
						}
					/>
				</Button>
			</ButtonGroup>
			<ToggleGroup
				onValueChange={(value) => setSearch({ table: value === "table" })}
				value={showTable ? "table" : "charts"}
			>
				<Tooltip tip="Chart view">
					<ToggleGroupItem aria-label="Charts" value="charts">
						<Icon icon={ChartArea} />
						<span className={collapsingLabel}>Charts</span>
					</ToggleGroupItem>
				</Tooltip>
				<Tooltip tip="Table view">
					<ToggleGroupItem aria-label="Table" value="table">
						<Icon icon={Table} />
						<span className={collapsingLabel}>Table</span>
					</ToggleGroupItem>
				</Tooltip>
			</ToggleGroup>
			<Tooltip tip="Show read pseudo-counts instead of weight">
				<ButtonToggle
					aria-label="Show Reads"
					onPressedChange={(reads) => setSearch({ reads })}
					pressed={Boolean(showReads)}
				>
					<Icon icon={Hash} />
					<span className={collapsingLabel}>Show Reads</span>
				</ButtonToggle>
			</Tooltip>
			<PathoscopeFilter />
			<PathoscopeExport analysis={analysis} />
		</SearchToolbar>
	);
}
