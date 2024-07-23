import { Dropdown, DropdownButton, DropdownMenuContent, DropdownMenuDownload, Icon, InputSearch, Toolbar } from "@base";
import { ButtonToggle } from "@base/ButtonToggle";
import { Tooltip } from "@base/Tooltip";
import { useUrlSearchParams } from "@utils/hooks";
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
    const [filterOTUs, setFilterOtus] = useUrlSearchParams<boolean>("filterOtus", true);
    const [filterIsolates, setFilterIsolates] = useUrlSearchParams<boolean>("filterIsolates", true);
    const [find, setFind] = useUrlSearchParams<string>("find", "");
    const [showReads, setShowReads] = useUrlSearchParams<boolean>("reads", false);
    const [sortKey, setSortKey] = useUrlSearchParams<string>("sort", "coverage");
    const [sortDesc, setSortDesc] = useUrlSearchParams<boolean>("sortDesc", true);

    return (
        <StyledPathoscopeToolbar>
            <InputSearch value={find} onChange={e => setFind(e.target.value)} />
            <AnalysisViewerSort workflow="pathoscope" sortKey={sortKey} onSelect={setSortKey} />
            <ButtonToggle onPressedChange={setSortDesc} pressed={sortDesc}>
                <Icon name={sortDesc ? "sort-amount-down" : "sort-amount-up"} />
            </ButtonToggle>
            <Tooltip tip="Show read pseudo-counts instead of weight">
                <ButtonToggle onPressedChange={setShowReads} pressed={showReads}>
                    Show Reads
                </ButtonToggle>
            </Tooltip>
            <Tooltip tip="Hide OTUs with low coverage support">
                <ButtonToggle onPressedChange={setFilterOtus} pressed={filterOTUs}>
                    Filter OTUs
                </ButtonToggle>
            </Tooltip>
            <Tooltip tip="Hide isolates with low coverage support">
                <ButtonToggle onPressedChange={setFilterIsolates} pressed={filterIsolates}>
                    Filter Isolates
                </ButtonToggle>
            </Tooltip>
            <Dropdown>
                <DropdownButton>
                    <span>
                        <Icon name="file-download" /> Export <Icon name="caret-down" />
                    </span>
                </DropdownButton>
                <DropdownMenuContent>
                    <DropdownMenuDownload href={`/api/analyses/documents/${analysisId}.csv`}>
                        <Icon name="file-csv" /> CSV
                    </DropdownMenuDownload>
                    <DropdownMenuDownload href={`/api/analyses/documents/${analysisId}.xlsx`}>
                        <Icon name="file-excel" /> Excel
                    </DropdownMenuDownload>
                </DropdownMenuContent>
            </Dropdown>
        </StyledPathoscopeToolbar>
    );
}
