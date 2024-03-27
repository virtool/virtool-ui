import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import styled from "styled-components";
import {
    Button,
    Dropdown,
    DropdownButton,
    DropdownMenuDownload,
    DropdownMenuList,
    Icon,
    InputSearch,
    Toolbar,
} from "../../../base";
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
    const [filterOTUs, setFilterOtu] = useUrlSearchParams<boolean>("filterOtus", true);
    const [filterIsolates, setFilterIsolates] = useUrlSearchParams<boolean>("filterIsolates", true);
    const [find, setFind] = useUrlSearchParams<string>("find", "");
    const [showReads, setShowReads] = useUrlSearchParams<boolean>("reads", false);
    const [sortKey, setSortKey] = useUrlSearchParams<string>("sort", "coverage");
    const [sortDesc, setSortDesc] = useUrlSearchParams<boolean>("sortDesc", true);

    return (
        <StyledPathoscopeToolbar>
            <InputSearch value={find} onChange={e => setFind(e.target.value)} />
            <AnalysisViewerSort workflow="pathoscope" sortKey={sortKey} onSelect={setSortKey} />
            <Button onClick={() => setSortDesc(!sortDesc)} tip="Sort Direction">
                <Icon name={sortDesc ? "sort-amount-down" : "sort-amount-up"} />
            </Button>
            <Button
                active={showReads}
                icon="weight-hanging"
                tip="Show read pseudo-counts instead of weight"
                onClick={() => setShowReads(!showReads)}
            >
                Show Reads
            </Button>
            <Button
                active={filterOTUs}
                icon="filter"
                tip="Hide OTUs with low coverage support"
                onClick={() => {
                    setFilterOtu(!filterOTUs);
                }}
            >
                Filter OTUs
            </Button>
            <Button
                active={filterIsolates}
                icon="filter"
                tip="Hide isolates with low coverage support"
                onClick={() => setFilterIsolates(!filterIsolates)}
            >
                Filter Isolates
            </Button>
            <Dropdown>
                <DropdownButton>
                    <span>
                        <Icon name="file-download" /> Export <Icon name="caret-down" />
                    </span>
                </DropdownButton>
                <DropdownMenuList>
                    <DropdownMenuDownload href={`/api/analyses/documents/${analysisId}.csv`}>
                        <Icon name="file-csv" /> CSV
                    </DropdownMenuDownload>
                    <DropdownMenuDownload href={`/api/analyses/documents/${analysisId}.xlsx`}>
                        <Icon name="file-excel" /> Excel
                    </DropdownMenuDownload>
                </DropdownMenuList>
            </Dropdown>
        </StyledPathoscopeToolbar>
    );
}
