import React from "react";
import { useFetchSettings } from "../../administration/queries";
import ContainerNarrow from "../../base/ContainerNarrow";
import LoadingPlaceholder from "../../base/LoadingPlaceholder";
import ViewHeader from "../../base/ViewHeader";
import ViewHeaderTitle from "../../base/ViewHeaderTitle";
import SampleRights from "./SampleRights";

export default function SamplesSettings() {
    const { data, isPending } = useFetchSettings();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <ViewHeader title="Sample Settings">
                <ViewHeaderTitle>Sample Settings</ViewHeaderTitle>
            </ViewHeader>
            <SampleRights settings={data} />
        </ContainerNarrow>
    );
}
