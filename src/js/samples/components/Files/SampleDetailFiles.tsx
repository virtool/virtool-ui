import { ContainerNarrow, LoadingPlaceholder } from "@base";
import React from "react";
import { match } from "react-router-dom";
import { useFetchSample } from "../../queries";
import SampleFileSizeWarning from "../Detail/SampleFileSizeWarning";
import SampleFilesMessage from "../SampleFilesMessage";
import SampleReads from "./SampleReads";

type SampleDetailFilesProps = {
    /** Match object containing path information */
    match: match<{ sampleId: string }>;
};

/**
 * The files view in sample details
 */
export function SampleDetailFiles({ match }: SampleDetailFilesProps) {
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
