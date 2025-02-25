import React from "react";
import styled from "styled-components";
import { getBorder } from "@app/theme";
import { BoxGroup, BoxGroupSection } from "@base";

const StyledCreateAnalysisSelectorList = styled(BoxGroup)`
    border: none;
    background-color: ${(props) => props.theme.color.greyLightest};
    margin: 0;
    overflow-y: auto;
    height: 160px;

    ${BoxGroupSection} {
        outline: ${getBorder};
    }
`;

interface CreateAnalysisSelectorListProps {
    className?: string;
    items: any[];
    render: (item: any) => JSX.Element;
}

export function CreateAnalysisSelectorList({
    className = "",
    items,
    render,
}: CreateAnalysisSelectorListProps) {
    return (
        <StyledCreateAnalysisSelectorList className={className}>
            {items.map((item) => render(item))}
        </StyledCreateAnalysisSelectorList>
    );
}
