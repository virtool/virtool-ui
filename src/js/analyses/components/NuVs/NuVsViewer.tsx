import { Sample } from "@samples/types";
import React from "react";
import styled from "styled-components";
import NuVsDetail from "./Detail";
import { NuVsList } from "./List";
import NuVsExport from "./NuVsExport";
import NuVsToolbar from "./Toolbar";

const NuVsPanes = styled.div`
    display: grid;
    grid-template-columns: 230px 1fr;
`;

type NuVsViewerProps = {
    /** Complete NuVs analysis details */
    detail: any;
    /** The sample that was analysed */
    sample: Sample;
};

/**
 * Detailed breakdown of the results of a NuVs analysis
 */
export default function NuVsViewer({ detail, sample }: NuVsViewerProps) {
    return (
        <div>
            <NuVsExport analysisId={detail.id} results={detail.results} sampleName={sample.name} />
            <NuVsToolbar />
            <NuVsPanes>
                <NuVsList />
                <NuVsDetail />
            </NuVsPanes>
        </div>
    );
}
