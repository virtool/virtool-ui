import React, { useCallback } from "react";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import { BoxGroupSection, Label } from "../../../base";

const StyledIndexSelectorItem = styled(BoxGroupSection)`
    background: white;
    display: flex;
    width: 100%;

    span {
        flex: 1 0 auto;
    }

    span:first-child {
        font-weight: ${getFontWeight("thick")};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    span:last-child {
        margin-left: auto;
    }
`;

export function IndexSelectorItem({ id, name, version, onClick }) {
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
