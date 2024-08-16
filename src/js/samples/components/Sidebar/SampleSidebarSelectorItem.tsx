import { BoxGroupSection, Icon } from "@base";
import { cn } from "@utils/utils";
import React from "react";
import styled from "styled-components";

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
        <BoxGroupSection
            className={cn("items-stretch", "flex", "pt-2.5", "pr-2.5", "pb-2.5", "pl-1.5")}
            as="button"
            type="button"
            onClick={() => onClick(id)}
            aria-label={name}
        >
            <SampleSidebarSelectorItemCheck>
                {selected && <Icon name={partiallySelected ? "minus" : "check"} />}
            </SampleSidebarSelectorItemCheck>
            <SampleSidebarSelectorItemContents>{children}</SampleSidebarSelectorItemContents>
        </BoxGroupSection>
    );
}
