import { endsWith, some } from "lodash-es";
import React from "react";
import { match } from "react-router-dom";
import { ContainerNarrow, LoadingPlaceholder } from "../../../base";
import { useFetchSample } from "../../querys";
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
            <SampleFileSizeWarning
                sampleId={data.id}
                show={some(data.reads, file => file.size < 10000000)}
                showLink={!endsWith(location.pathname, "/files")}
            />
            <SampleFilesMessage />
            <SampleReads reads={data.reads} />
        </ContainerNarrow>
    );
}
