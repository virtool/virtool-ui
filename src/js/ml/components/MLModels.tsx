import {
    ContainerNarrow,
    LoadingPlaceholder,
    NoneFoundBox,
    ViewHeader,
    ViewHeaderTitle,
} from "@base";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { map } from "lodash";
import React from "react";
import { useFindModels } from "../queries";
import { MLModelMinimal } from "../types";
import { MLModel } from "./MLModel";

function renderRow({ created_at, name, latest_release, id }: MLModelMinimal) {
    return (
        <MLModel
            created_at={created_at}
            name={name}
            latest_release={latest_release}
            key={id}
        />
    );
}

/**
 * A list of MLModels
 *
 * @returns A list of MLModels
 */
export function MLModels() {
    const { data, isPending } = useFindModels();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const models = data.items.length ? (
        map(data.items, renderRow)
    ) : (
        <NoneFoundBox noun={"machine learning models"} />
    );

    return (
        <ContainerNarrow>
            <ViewHeader title="ML Models">
                <ViewHeaderTitle>
                    ML Models{" "}
                    <ViewHeaderTitleBadge>
                        {data.items.length}
                    </ViewHeaderTitleBadge>
                </ViewHeaderTitle>
            </ViewHeader>
            {models}
        </ContainerNarrow>
    );
}
