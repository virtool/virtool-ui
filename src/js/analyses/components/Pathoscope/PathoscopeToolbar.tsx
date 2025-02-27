import {
    Dropdown,
    DropdownButton,
    DropdownMenuContent,
    DropdownMenuDownload,
    Icon,
    InputSearch,
} from "@base";
import { ButtonToggle } from "@base/ButtonToggle";
import Toolbar from "@base/Toolbar";
import { Tooltip } from "@base/Tooltip";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
import styled from "styled-components";
import { AnalysisViewerSort } from "../Viewer/Sort";

const StyledPathoscopeToolbar = styled(Toolbar)`
    display: flex;
    margin-bottom: 10px !important;
`;

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
        <StyledPathoscopeToolbar>
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
                <Icon name={sortDesc ? "sort-amount-down" : "sort-amount-up"} />
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
                        <Icon name="file-download" /> Export{" "}
                        <Icon name="caret-down" />
                    </span>
                </DropdownButton>
                <DropdownMenuContent>
                    <DropdownMenuDownload
                        href={`/api/analyses/documents/${analysisId}.csv`}
                    >
                        <Icon name="file-csv" /> CSV
                    </DropdownMenuDownload>
                    <DropdownMenuDownload
                        href={`/api/analyses/documents/${analysisId}.xlsx`}
                    >
                        <Icon name="file-excel" /> Excel
                    </DropdownMenuDownload>
                </DropdownMenuContent>
            </Dropdown>
        </StyledPathoscopeToolbar>
    );
}
