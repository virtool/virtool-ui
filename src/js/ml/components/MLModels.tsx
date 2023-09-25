import { map } from "lodash";
import React from "react";
import { Badge, ContainerNarrow, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "../../base";
import { useFindModels } from "../queries";
import { MLModel } from "./MLModel";

/**
 * A list of MLModels
 *
 * @returns A list of MLModels
 */
export function MLModels() {
    const { data, isLoading } = useFindModels();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const models = map(data.items, ({ created_at, name, latest_release }) => (
        <MLModel created_at={created_at} name={name} latest_release={latest_release} />
    ));

    return (
        <ContainerNarrow>
            <ViewHeader title="ML Models">
                <ViewHeaderTitle>
                    ML Models <Badge>{data.items.length}</Badge>
                </ViewHeaderTitle>
            </ViewHeader>
            {models}
        </ContainerNarrow>
    );
}
