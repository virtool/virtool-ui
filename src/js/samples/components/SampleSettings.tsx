import React from "react";
import { useFetchSettings } from "../../administration/queries";
import { ContainerNarrow, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "../../base";
import SampleRights from "./SampleRights";

export default function SamplesSettings() {
    const { data, isLoading } = useFetchSettings();

    if (isLoading) {
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
