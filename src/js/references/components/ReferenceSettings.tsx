import React from "react";
import { useFetchSettings } from "../../administration/queries";
import { ContainerNarrow, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "../../base";
import { GlobalSourceTypes } from "./SourceTypes/GlobalSourceTypes";

export function ReferenceSettings() {
    const { data, isLoading } = useFetchSettings();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <ViewHeader title="Reference Settings">
                <ViewHeaderTitle>Settings</ViewHeaderTitle>
            </ViewHeader>
            <GlobalSourceTypes sourceTypes={data.default_source_types} />
        </ContainerNarrow>
    );
}
