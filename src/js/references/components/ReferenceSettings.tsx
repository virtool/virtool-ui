import { useFetchSettings } from "@administration/queries";
import {
    ContainerNarrow,
    LoadingPlaceholder,
    ViewHeader,
    ViewHeaderTitle,
} from "@/base";
import React from "react";
import { GlobalSourceTypes } from "./SourceTypes/GlobalSourceTypes";

export default function ReferenceSettings() {
    const { data, isPending } = useFetchSettings();

    if (isPending) {
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
