import { ContainerNarrow, LoadingPlaceholder } from "@base";
import React from "react";
import { useMatch } from "react-router-dom-v5-compat";
import { useFetchSample } from "../../queries";
import SampleFileSizeWarning from "../Detail/SampleFileSizeWarning";
import SampleFilesMessage from "../SampleFilesMessage";
import SampleReads from "./SampleReads";

/**
 * The files view in sample details
 */
export function SampleDetailFiles() {
    const match = useMatch("/samples/:sampleId/files");
    const { data, isPending } = useFetchSample(match.params.sampleId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <SampleFileSizeWarning reads={data.reads} sampleId={data.id} />
            <SampleFilesMessage showLegacy={data.is_legacy} />
            <SampleReads reads={data.reads} />
        </ContainerNarrow>
    );
}
