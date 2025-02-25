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
    color: ${(props) => props.theme.color.greyDark};
    display: flex;
    justify-content: center;
    margin-right: 5px;
    width: 32px;
`;

const SampleSidebarSelectorItemContents = styled.div`
    display: flex;
    align-items: center;
`;

type SampleSidebarSelectorItemProps = {
    children: React.ReactNode;
    id: string | number;
    name: string;
    /** A callback function to handle item selection */
    onClick: (id: string | number) => void;
    partiallySelected: boolean;
    selected: boolean;
};

/**
 * A condensed sidebar item for use in a list of sidebar items
 */
export function SampleSidebarSelectorItem({
    children,
    id,
    name,
    onClick,
    partiallySelected,
    selected,
}: SampleSidebarSelectorItemProps) {
    return (
        <StyledSampleSidebarSelectorItem
            as="button"
            type={"button"}
            onClick={() => onClick(id)}
            aria-label={name}
        >
            <SampleSidebarSelectorItemCheck>
                {selected && (
                    <Icon name={partiallySelected ? "minus" : "check"} />
                )}
            </SampleSidebarSelectorItemCheck>
            <SampleSidebarSelectorItemContents>
                {children}
            </SampleSidebarSelectorItemContents>
        </StyledSampleSidebarSelectorItem>
    );
}
