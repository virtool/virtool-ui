import { ContainerNarrow, LoadingPlaceholder } from "@base";
import React from "react";
import { useParams } from "react-router-dom-v5-compat";
import { useFetchSample } from "../../queries";
import SampleFileSizeWarning from "../Detail/SampleFileSizeWarning";
import SampleFilesMessage from "../SampleFilesMessage";
import SampleReads from "./SampleReads";

/**
 * The files view in sample details
 */
export function SampleDetailFiles() {
    const { sampleId } = useParams();
    const { data, isPending } = useFetchSample(sampleId);

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
