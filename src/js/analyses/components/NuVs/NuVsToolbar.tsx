import { Button, InputSearch, LinkButton, Toolbar } from "@base";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import styled from "styled-components";
import { AnalysisViewerSort } from "../Viewer/Sort";

const StyledNuVsToolbar = styled(Toolbar)`
    margin-bottom: 10px;
`;

/**
 * Displays a toolbar for managing and filtering NuVs
 */
export default function NuVsToolbar() {
    const [filterORFs, setFilterORFs] = useUrlSearchParams<boolean>("filterOrfs", true);
    const [filterSequences, setFilterSequences] = useUrlSearchParams<boolean>("filterSequences", true);
    const [find, setFind] = useUrlSearchParams<string>("find", "");
    const [sortKey, setSortKey] = useUrlSearchParams<string>("sort", "length");

    return (
        <StyledNuVsToolbar>
            <InputSearch value={find} onChange={e => setFind(e.target.value)} placeholder="Name or family" />
            <AnalysisViewerSort workflow="nuvs" sortKey={sortKey} onSelect={setSortKey} />
            <Button
                icon="filter"
                onClick={() => setFilterSequences(!filterSequences)}
                active={filterSequences}
                tip="Hide sequences that have no HMM hits"
            >
                Filter Sequences
            </Button>
            <Button
                icon="filter"
                onClick={() => setFilterORFs(!filterORFs)}
                active={filterORFs}
                tip="Hide ORFs that have no HMM hits"
            >
                Filter ORFs
            </Button>
            <LinkButton to={{ state: { export: true } }} tip="Export">
                Export
            </LinkButton>
        </StyledNuVsToolbar>
    );
}
