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
    const [filterORFs, setFilterORFs] = useUrlSearchParams("filterOrfs", "true");
    const [filterSequences, setFilterSequences] = useUrlSearchParams("filterSequences", "true");
    const [find, setFind] = useUrlSearchParams("find", "");
    const [sortKey, setSortKey] = useUrlSearchParams("sort", "length");

    return (
        <Toolbar>
            <InputSearch value={find} onChange={e => setFind(e.target.value)} placeholder="Name or family" />
            <AnalysisViewerSort workflow="nuvs" sortKey={sortKey} onSelect={setSortKey} />
            <Tooltip tip="Hide sequences that have no HMM hits">
                <ButtonToggle
                    onPressedChange={active => setFilterSequences(active ? "true" : "")}
                    pressed={Boolean(filterSequences)}
                >
                    Filter Sequences
                </ButtonToggle>
            </Tooltip>
            <Tooltip tip="Hide ORFs that have no HMM hits">
                <ButtonToggle
                    pressed={Boolean(filterORFs)}
                    onPressedChange={active => setFilterORFs(active ? "true" : "")}
                >
                    Filter ORFs
                </ButtonToggle>
            </Tooltip>
            <NuVsExport analysisId={analysisId} results={results} sampleName={sampleName} />
        </Toolbar>
    );
}
