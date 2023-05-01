import React, { useCallback } from "react";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import { BoxGroupSection, Label } from "../../../base";

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

interface IndexSelectorItemProps {
    id: string;
    name: string;
    version: number;
    onClick: (id: string) => void;
}

export function IndexSelectorItem({ id, name, version, onClick }: IndexSelectorItemProps) {
    const handleClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <StyledIndexSelectorItem onClick={handleClick}>
            <span>{name}</span>
            <span>
                Index Version <Label>{version}</Label>
            </span>
        </StyledIndexSelectorItem>
    );
}
