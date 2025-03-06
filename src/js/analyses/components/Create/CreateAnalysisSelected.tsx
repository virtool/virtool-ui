import BoxGroup from "@base/BoxGroup";
import PseudoLabel from "@base/PseudoLabel";
import React from "react";
import styled from "styled-components";

const NoneSelected = styled.span`
    color: ${(props) => props.theme.color.greyDarkest};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

type SelectedContainer = {
    error?: boolean;
};

const SelectedContainer = styled(BoxGroup)<SelectedContainer>`
    background-color: ${(props) => props.theme.color.greyLightest};
    flex: 1 1 auto;
    ${(props) =>
        props.error ? `border-color: ${props.theme.color.red};` : ""};
    overflow-y: auto;
    height: 160px;
    margin-bottom: 0px;
`;

const SelectedItemsContainer = styled.div`
    background-color: white;
    outline: 1px solid ${(props) => props.theme.color.greyLight};
`;

const StyledCreateAnalysisSelected = styled.div`
    display: flex;
    flex-direction: column;
`;

export function CreateAnalysisSelected({ items, render }) {
    return (
        <StyledCreateAnalysisSelected>
            <PseudoLabel>Selected</PseudoLabel>
            <SelectedContainer>
                {items.length ? (
                    <SelectedItemsContainer>
                        {items.map((item) => render(item))}
                    </SelectedItemsContainer>
                ) : (
                    <NoneSelected>Nothing selected</NoneSelected>
                )}
            </SelectedContainer>
        </StyledCreateAnalysisSelected>
    );
}
