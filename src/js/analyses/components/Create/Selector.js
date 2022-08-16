import React from "react";
import styled from "styled-components";
import { BoxGroup, InputError } from "../../../base";

const CreateAnalysisSelectorContainer = styled(BoxGroup)`
    ${props => (props.error ? `border-color: ${props.theme.color.red};` : "")};
`;

const StyledCreateAnalysisSelector = styled.div`
    min-width: 0;
`;

export const CreateAnalysisSelector = ({ children, error }) => (
    <StyledCreateAnalysisSelector>
        <label>Available</label>
        <CreateAnalysisSelectorContainer>
            {children}
            {error && <InputError>{error}</InputError>}
        </CreateAnalysisSelectorContainer>
    </StyledCreateAnalysisSelector>
);
