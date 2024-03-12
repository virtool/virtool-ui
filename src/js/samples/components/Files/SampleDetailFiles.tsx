import React from "react";
import { match } from "react-router-dom";
import { ContainerNarrow, LoadingPlaceholder } from "../../../base";
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
    const { data, isLoading } = useFetchSample(match.params.sampleId);

    if (isLoading) {
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
