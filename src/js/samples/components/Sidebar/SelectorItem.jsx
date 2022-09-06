import React from "react";
import styled from "styled-components";
import { getFontSize } from "../../../app/theme";
import { BoxGroupSection, Icon } from "../../../base";

const StyledSampleSidebarSelectorItem = styled(BoxGroupSection)`
    align-items: stretch;
    display: flex;
    padding: 10px 10px 10px 5px;

    p {
        font-size: ${getFontSize("md")};
        margin: 5px 0 0;
    }
`;

const SampleSidebarSelectorItemCheck = styled.div`
    align-items: center;
    color: ${props => props.theme.color.greyDark};
    display: flex;
    justify-content: center;
    margin-right: 5px;
    width: 32px;
`;

const SampleSidebarSelectorItemContents = styled.div`
    display: flex;
    align-items: center;
`;

export const SampleSidebarSelectorItem = ({ selected, partiallySelected, children, id, onClick, name }) => {
    const handleSelect = () => onClick(id);

    return (
        <StyledSampleSidebarSelectorItem as="button" type={"button"} onClick={handleSelect} aria-label={name}>
            <SampleSidebarSelectorItemCheck>
                {selected && <Icon name={partiallySelected ? "minus" : "check"} />}
            </SampleSidebarSelectorItemCheck>
            <SampleSidebarSelectorItemContents>{children}</SampleSidebarSelectorItemContents>
        </StyledSampleSidebarSelectorItem>
    );
};
