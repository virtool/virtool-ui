import React, { useCallback } from "react";
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

export const SampleSidebarSelectorItem = ({ checked, children, id, onClick }) => {
    const handleSelect = useCallback(() => onClick(id), [id, onClick]);

    return (
        <StyledSampleSidebarSelectorItem as="button" type={"button"} onClick={handleSelect}>
            <SampleSidebarSelectorItemCheck>{checked && <Icon name="check" />}</SampleSidebarSelectorItemCheck>
            <SampleSidebarSelectorItemContents>{children}</SampleSidebarSelectorItemContents>
        </StyledSampleSidebarSelectorItem>
    );
};
