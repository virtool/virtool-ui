import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";

import { Badge, BoxGroup, BoxGroupSection } from "../../../base";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";

const SelectedSamplesList = styled(BoxGroup)`
    margin-bottom: 15px;
    max-height: 220px;
    overflow-y: ${props => (props.count > 1 ? "scroll" : "auto")};

    div {
        margin-bottom: 0;
    }
`;

export function SelectedSamples({ samples }) {
    const count = samples.length;

    const sampleComponents = map(samples, ({ id, name }) => (
        <BoxGroupSection key={id} disabled>
            {name}
        </BoxGroupSection>
    ));

    return (
        <>
            <CreateAnalysisFieldTitle>
                Compatible Samples <Badge>{count}</Badge>
            </CreateAnalysisFieldTitle>
            <SelectedSamplesList count={count}>{sampleComponents}</SelectedSamplesList>
        </>
    );
}
