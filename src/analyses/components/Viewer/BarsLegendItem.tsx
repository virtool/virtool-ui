import { toThousand } from "@app/utils";
import Icon from "@base/Icon";
import { IconColor } from "@jobs/types";
import React from "react";
import styled from "styled-components";

const StyledBarsLegendItem = styled.div`
    align-items: center;
    display: flex;
    margin-top: 3px;
    max-width: 480px;

    i:first-child {
        margin-right: 10px;
    }

    span:last-child {
        margin-left: auto;
    }
`;

interface BarsLegendItemProps {
    color: IconColor;
    count: number;
    title: string;
}

export function BarsLegendItem({ color, count, title }: BarsLegendItemProps) {
    return (
        <StyledBarsLegendItem>
            <Icon name="circle" color={color} />
            <span>{title}</span>
            <span>{toThousand(count)}</span>
        </StyledBarsLegendItem>
    );
}
