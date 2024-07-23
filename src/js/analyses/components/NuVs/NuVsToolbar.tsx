import NuVsExport, { NuVsExportProps } from "@/analyses/components/NuVs/NuVsExport";
import { InputSearch, Toolbar } from "@base";
import { ButtonToggle } from "@base/ButtonToggle";
import { Tooltip } from "@base/Tooltip";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import { AnalysisViewerSort } from "../Viewer/Sort";

/**
 * Displays a toolbar for managing and filtering NuVs
 */
export default function NuVsToolbar({ analysisId, results, sampleName }: NuVsExportProps) {
    const [filterORFs, setFilterORFs] = useUrlSearchParams<boolean>("filterOrfs", true);
    const [filterSequences, setFilterSequences] = useUrlSearchParams<boolean>("filterSequences", true);
    const [find, setFind] = useUrlSearchParams<string>("find", "");
    const [sortKey, setSortKey] = useUrlSearchParams<string>("sort", "length");

    return (
        <Toolbar>
            <InputSearch value={find} onChange={e => setFind(e.target.value)} placeholder="Name or family" />
            <AnalysisViewerSort workflow="nuvs" sortKey={sortKey} onSelect={setSortKey} />
            <Tooltip tip="Hide sequences that have no HMM hits">
                <ButtonToggle onPressedChange={setFilterSequences} pressed={filterSequences}>
                    Filter Sequences
                </ButtonToggle>
            </Tooltip>
            <Tooltip tip="Hide ORFs that have no HMM hits">
                <ButtonToggle pressed={filterORFs} onPressedChange={setFilterORFs}>
                    Filter ORFs
                </ButtonToggle>
            </Tooltip>
            <NuVsExport analysisId={analysisId} results={results} sampleName={sampleName} />
        </Toolbar>
    );
}
