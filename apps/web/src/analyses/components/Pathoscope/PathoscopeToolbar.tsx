import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
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
	ArrowDownWideNarrow,
	ArrowUpWideNarrow,
	ChevronDown,
	File,
	FileDown,
} from "lucide-react";
import { AnalysisViewerSort } from "../Viewer/Sort";

type PathoscopeToolbarProps = {
	/** The unique identifier the analysis being viewed */
	analysisId: number;
};

/** A selection of filters and toggles for pathoscope data presentation */
export function PathoscopeToolbar({ analysisId }: PathoscopeToolbarProps) {
	const { search, setSearch } = useAnalysisSearch();
	const filterOtus = search.filterOtus ?? true;
	const filterIsolates = search.filterIsolates ?? true;
	const find = search.find ?? "";
	const showReads = search.reads ?? false;
	const sortKey = search.sortKey ?? "coverage";
	const sortDirection = search.sortDirection ?? "desc";
	const showTable = search.table ?? false;

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
				<ButtonToggle
					ariaLabel={
						sortDirection === "desc" ? "Sort ascending" : "Sort descending"
					}
					onPressedChange={(pressed) =>
						setSearch({ sortDirection: pressed ? "desc" : "asc" })
					}
					pressed={sortDirection === "desc"}
				>
					<Icon
						icon={
							sortDirection === "desc" ? ArrowDownWideNarrow : ArrowUpWideNarrow
						}
					/>
				</ButtonToggle>
			</ButtonGroup>
			<ToggleGroup
				onValueChange={(value) => setSearch({ table: value === "table" })}
				value={showTable ? "table" : "charts"}
			>
				<ToggleGroupItem value="charts">Charts</ToggleGroupItem>
				<ToggleGroupItem value="table">Table</ToggleGroupItem>
			</ToggleGroup>
			<Tooltip tip="Show read pseudo-counts instead of weight">
				<ButtonToggle
					onPressedChange={(reads) => setSearch({ reads })}
					pressed={Boolean(showReads)}
				>
					Show Reads
				</ButtonToggle>
			</Tooltip>
			<Tooltip tip="Hide OTUs with low coverage support">
				<ButtonToggle
					onPressedChange={(filterOtus) => setSearch({ filterOtus })}
					pressed={Boolean(filterOtus)}
				>
					Filter OTUs
				</ButtonToggle>
			</Tooltip>
			{/* Isolates are only ever shown in an expanded hit, which the table
			    layout has none of — the toggle would change nothing on screen. */}
			{!showTable && (
				<Tooltip tip="Hide isolates with low coverage support">
					<ButtonToggle
						onPressedChange={(filterIsolates) => setSearch({ filterIsolates })}
						pressed={Boolean(filterIsolates)}
					>
						Filter Isolates
					</ButtonToggle>
				</Tooltip>
			)}
			<Dropdown>
				<DropdownButton>
					<span>
						<Icon icon={FileDown} /> Export <Icon icon={ChevronDown} />
					</span>
				</DropdownButton>
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
