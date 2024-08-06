import { getFontWeight } from "@app/theme";
import { BoxGroupSection, Label } from "@base";
import React, { useCallback } from "react";
import styled from "styled-components";

const StyledIndexSelectorItem = styled(BoxGroupSection)`
    background: white;
    display: flex;
    gap: ${props => props.theme.gap.column};
    justify-content: space-between;

    span:first-child {
        font-weight: ${getFontWeight("thick")};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    span:last-child {
        flex: 0 1 auto;
        white-space: nowrap;
    }
`;

type IndexSelectorItemProps = {
    /** Whether the index can be selected or not */
    disabled?: boolean;
    id: string;
    name: string;
    /** A callback function to handle index selection */
    onClick: (id: string) => void;
    version: number;
};

/**
 * A condensed index selector item to be used in a list of index selectors
 */
export function IndexSelectorItem({ disabled, id, name, onClick, version }: IndexSelectorItemProps) {
    const handleClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <StyledIndexSelectorItem onClick={handleClick} disabled={disabled}>
            <span>{name}</span>
            <span>
                Index Version <Label>{version}</Label>
            </span>
        </StyledIndexSelectorItem>
    );
}
