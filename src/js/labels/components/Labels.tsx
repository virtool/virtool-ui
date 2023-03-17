import { map, sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import {
    BoxGroup,
    ContainerNarrow,
    LoadingPlaceholder,
    NoneFoundSection,
    ViewHeader,
    ViewHeaderSubtitle,
    ViewHeaderTitle
} from "../../base";
import { useFetchLabels } from "../hooks";
import { CreateLabel } from "./Create";
import { Item } from "./Item";

const LabelsHeader = styled(ViewHeader)`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

export function Labels() {
    const { data, isLoading } = useFetchLabels();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <LabelsHeader title="Labels">
                <div>
                    <ViewHeaderTitle>Labels</ViewHeaderTitle>
                    <ViewHeaderSubtitle>Use labels to organize samples.</ViewHeaderSubtitle>
                </div>

                <CreateLabel />
            </LabelsHeader>

            <BoxGroup>
                {data.length ? (
                    map(sortBy(data, "name"), label => (
                        <Item
                            key={label.id}
                            name={label.name}
                            color={label.color}
                            description={label.description}
                            id={label.id}
                        />
                    ))
                ) : (
                    <NoneFoundSection noun="labels" />
                )}
            </BoxGroup>
        </ContainerNarrow>
    );
}
