import { InputError } from "@/base";
import BoxGroup from "@base/BoxGroup";
import PseudoLabel from "@base/PseudoLabel";
import React, { ReactNode } from "react";
import styled from "styled-components";

const StyledCreateAnalysisSelector = styled.div`
    min-width: 0;

    div {
        margin-bottom: 0;
    }
`;

interface CreateAnalysisSelectorProps {
    children: ReactNode;
    error?: string;
}

export function CreateAnalysisSelector({
    children,
    error = "",
}: CreateAnalysisSelectorProps) {
    return (
        <StyledCreateAnalysisSelector>
            <PseudoLabel>Available</PseudoLabel>
            <BoxGroup>
                {children}
                {error && <InputError>{error}</InputError>}
            </BoxGroup>
        </StyledCreateAnalysisSelector>
    );
}
