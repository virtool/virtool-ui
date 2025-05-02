import { useUrlSearchParam } from "../../../app/hooks";
import NuvsExport, {
    NuvsExportProps,
} from "./NuvsExport";
import ButtonToggle from "../../../base/ButtonToggle";
import InputSearch from "../../../base/InputSearch";
import Toolbar from "../../../base/Toolbar";
import Tooltip from "../../../base/Tooltip";
import React from "react";
import { AnalysisViewerSort } from "../Viewer/Sort";

/**
 * Displays a toolbar for managing and filtering NuVs
 */
export default function NuvsToolbar({
    analysisId,
    results,
    sampleName,
}: NuvsExportProps) {
    const { value: filterORFs, setValue: setFilterORFs } =
        useUrlSearchParam<boolean>("filterOrfs", true);

    const { value: filterSequences, setValue: setFilterSequences } =
        useUrlSearchParam<boolean>("filterSequences", true);

    const { value: find, setValue: setFind } = useUrlSearchParam<string>(
        "find",
        "",
    );

    const { value: sortKey, setValue: setSortKey } = useUrlSearchParam<string>(
        "sort",
        "length",
    );

    return (
        <Toolbar>
            <div className="flex-grow">
                <InputSearch
                    value={find}
                    onChange={(e) => setFind(e.target.value)}
                    placeholder="Name or family"
                />
            </div>
            <AnalysisViewerSort
                workflow="nuvs"
                sortKey={sortKey}
                onSelect={setSortKey}
            />
            <Tooltip tip="Hide sequences that have no HMM hits">
                <ButtonToggle
                    onPressedChange={(active) => setFilterSequences(active)}
                    pressed={filterSequences}
                >
                    Filter Sequences
                </ButtonToggle>
            </Tooltip>
            <Tooltip tip="Hide ORFs that have no HMM hits">
                <ButtonToggle
                    pressed={filterORFs}
                    onPressedChange={(active) => setFilterORFs(active)}
                >
                    Filter ORFs
                </ButtonToggle>
            </Tooltip>
            <NuvsExport
                analysisId={analysisId}
                results={results}
                sampleName={sampleName}
            />
        </Toolbar>
    );
}
