import { useUrlSearchParam } from "@app/hooks";
import ButtonToggle from "@base/ButtonToggle";
import Dropdown from "@base/Dropdown";
import DropdownButton from "@base/DropdownButton";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuDownload from "@base/DropdownMenuDownload";
import Icon from "@base/Icon";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
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
    analysisId: string;
};

/** A selection of filters and toggles for pathoscope data presentation */
export function PathoscopeToolbar({ analysisId }: PathoscopeToolbarProps) {
    const { value: filterOTUs, setValue: setFilterOtus } =
        useUrlSearchParam<boolean>("filterOtus", true);

    const { value: filterIsolates, setValue: setFilterIsolates } =
        useUrlSearchParam<boolean>("filterIsolates", true);

    const { value: find, setValue: setFind } =
        useUrlSearchParam<string>("find");

    const { value: showReads, setValue: setShowReads } =
        useUrlSearchParam<boolean>("reads", false);

    const { value: sortKey, setValue: setSortKey } = useUrlSearchParam<string>(
        "sort",
        "coverage",
    );

    const { value: sortDesc, setValue: setSortDesc } =
        useUrlSearchParam<boolean>("sortDesc", true);

    return (
        <Toolbar>
            <InputSearch
                value={find}
                onChange={(e) => setFind(e.target.value)}
            />
            <AnalysisViewerSort
                workflow="pathoscope"
                sortKey={sortKey}
                onSelect={setSortKey}
            />
            <ButtonToggle
                onPressedChange={(active) => setSortDesc(active)}
                pressed={Boolean(sortDesc)}
            >
                <Icon icon={sortDesc ? ArrowDownWideNarrow : ArrowUpWideNarrow} />
            </ButtonToggle>
            <Tooltip tip="Show read pseudo-counts instead of weight">
                <ButtonToggle
                    onPressedChange={(active) => setShowReads(active)}
                    pressed={Boolean(showReads)}
                >
                    Show Reads
                </ButtonToggle>
            </Tooltip>
            <Tooltip tip="Hide OTUs with low coverage support">
                <ButtonToggle
                    onPressedChange={(active) => setFilterOtus(active)}
                    pressed={Boolean(filterOTUs)}
                >
                    Filter OTUs
                </ButtonToggle>
            </Tooltip>
            <Tooltip tip="Hide isolates with low coverage support">
                <ButtonToggle
                    onPressedChange={(active) => setFilterIsolates(active)}
                    pressed={Boolean(filterIsolates)}
                >
                    Filter Isolates
                </ButtonToggle>
            </Tooltip>
            <Dropdown>
                <DropdownButton>
                    <span>
                        <Icon icon={FileDown} /> Export{" "}
                        <Icon icon={ChevronDown} />
                    </span>
                </DropdownButton>
                <DropdownMenuContent>
                    <DropdownMenuDownload
                        href={`/api/analyses/documents/${analysisId}.csv`}
                    >
                        <Icon icon={File} /> CSV
                    </DropdownMenuDownload>
                    <DropdownMenuDownload
                        href={`/api/analyses/documents/${analysisId}.xlsx`}
                    >
                        <Icon icon={File} /> Excel
                    </DropdownMenuDownload>
                </DropdownMenuContent>
            </Dropdown>
        </Toolbar>
    );
}
