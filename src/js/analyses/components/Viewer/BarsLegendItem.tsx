import { toThousand } from "@utils/utils";
import React from "react";
import styled from "styled-components";
import { Icon } from "../../../base";
import { IconColor } from "../../../jobs/types";

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
