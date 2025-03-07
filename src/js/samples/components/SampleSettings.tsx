import { useFetchSettings } from "@administration/queries";
import { LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "@base";
import ContainerNarrow from "@base/ContainerNarrow";
import React from "react";
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
