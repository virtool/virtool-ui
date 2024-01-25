import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { area } from "d3-shape";
import React, { useEffect, useRef } from "react";
import styled, { DefaultTheme } from "styled-components";

function draw(element, data, length, yMax) {
    select(element).append("svg");

    const margin = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    };

    const height = 100 - margin.top - margin.bottom;

    const width = (length > 800 ? length / 5 : length) - margin.left - margin.right;

    const x = scaleLinear().range([0, width]).domain([0, length]);
    const y = scaleLinear().range([height, 0]).domain([0, yMax]);

    select(element).selectAll("*").remove();

    const svg = select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    if (data) {
        const areaDrawer = area()
            .x((d, i) => x(i))
            .y0(d => y(d))
            .y1(height);

        svg.append("path").datum(data).attr("class", "depth-area").attr("d", areaDrawer);
    }
}

type StyledIimiCoverageChartProps = {
    theme: DefaultTheme;
};

const StyledIimiCoverageChart = styled.div<StyledIimiCoverageChartProps>`
    display: inline-block;
    margin-top: 5px;

    path.depth-area {
        fill: ${props => props.theme.color.blue};
    }
`;

interface IimiCoverageChartProps {
    data: any;
    id: string;
    yMax: number;
}

export function IimiCoverageChart({ data, id, yMax }: IimiCoverageChartProps) {
    const chartEl = useRef(null);

    useEffect(() => {
        const length = data.length;
        draw(chartEl.current, data, length, yMax);
    }, [data, id, yMax]);

    return <StyledIimiCoverageChart ref={chartEl} />;
}
