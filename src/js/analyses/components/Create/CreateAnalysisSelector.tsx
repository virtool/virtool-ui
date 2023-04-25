import React, { ReactNode } from "react";
import styled from "styled-components";
import { BoxGroup, InputError } from "../../../base";

const StyledCreateAnalysisSelector = styled.div`
    min-width: 0;
`;

interface CreateAnalysisSelectorProps {
    children: ReactNode;
    error?: string;
}

export function CreateAnalysisSelector({ children, error = "" }: CreateAnalysisSelectorProps) {
    return (
        <StyledCreateAnalysisSelector>
            <label>Available</label>
            <BoxGroup>
                {children}
                {error && <InputError>{error}</InputError>}
            </BoxGroup>
        </StyledCreateAnalysisSelector>
    );
}
