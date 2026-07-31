import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import Button from "@base/Button";
import ButtonGroup from "@base/ButtonGroup";
import ButtonToggle from "@base/ButtonToggle";
import Dropdown from "@base/Dropdown";
import DropdownButton from "@base/DropdownButton";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuDownload from "@base/DropdownMenuDownload";
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
	ChevronDown,
	File,
	FileDown,
	Hash,
	Table,
} from "lucide-react";
import { AnalysisViewerSort } from "../Viewer/Sort";
import { collapsingLabel } from "./collapsingLabel";
import PathoscopeFilter from "./PathoscopeFilter";

type PathoscopeToolbarProps = {
	/** The unique identifier the analysis being viewed */
	analysisId: number;
};

/** A selection of filters and toggles for pathoscope data presentation */
export function PathoscopeToolbar({ analysisId }: PathoscopeToolbarProps) {
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
			<Dropdown>
				<Tooltip tip="Export results">
					<DropdownButton aria-label="Export">
						<Icon icon={FileDown} />
						<span className={collapsingLabel}>Export</span>
						<Icon icon={ChevronDown} />
					</DropdownButton>
				</Tooltip>
				<DropdownMenuContent>
					<DropdownMenuDownload href={`/analyses/documents/${analysisId}.csv`}>
						<Icon icon={File} /> CSV
					</DropdownMenuDownload>
					<DropdownMenuDownload href={`/analyses/documents/${analysisId}.xlsx`}>
						<Icon icon={File} /> Excel
					</DropdownMenuDownload>
				</DropdownMenuContent>
			</Dropdown>
		</SearchToolbar>
	);
}
