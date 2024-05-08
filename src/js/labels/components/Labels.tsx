import React from "react";
import styled from "styled-components";
import {
    BoxGroup,
    ContainerNarrow,
    LoadingPlaceholder,
    NoneFoundSection,
    ViewHeader,
    ViewHeaderSubtitle,
    ViewHeaderTitle,
} from "../../base";
import { useFetchLabels } from "../queries";
import { CreateLabel } from "./CreateLabel";
import { LabelItem } from "./LabelItem";

const LabelsHeader = styled(ViewHeader)`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

/**
 * Display and manage a list of labels
 */
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
                    data.map(label => (
                        <LabelItem
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
