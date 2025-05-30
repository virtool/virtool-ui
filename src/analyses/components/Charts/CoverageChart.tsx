import { UntrustworthyRange } from "@analyses/types";
import { deriveTrustworthyRegions } from "@analyses/utils";
import { theme } from "@app/theme";
import { area, axisBottom, axisLeft, format, scaleLinear, select } from "d3";
import React, { useEffect, useRef } from "react";
import styled, { DefaultTheme } from "styled-components";

function draw(element, data, length, yMax, untrustworthyRanges) {
    select(element).append("svg");

    const margin = {
        top: 5,
        left: 35,
        bottom: 20,
        right: 0,
    };

    const height = 100 - margin.top - margin.bottom;

    const width =
        (length > 800 ? length / 5 : length) - margin.left - margin.right;

    const x = scaleLinear().range([1, width]).domain([0, length]);
    const y = scaleLinear().range([height, 0]).domain([0, yMax]).nice(5);

    const yAxis = axisLeft(y).ticks(5).tickFormat(format(".2s"));
    const xAxis = axisBottom(x).ticks(5).tickFormat(format(".1s"));

    select(element).selectAll("*").remove();

    const svg = select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const trustworthyRanges = deriveTrustworthyRegions(
        length,
        untrustworthyRanges,
    );

    if (trustworthyRanges.length) {
        trustworthyRanges.forEach((range) => {
            svg.append("rect")
                .attr("x", x(range[0]))
                .attr("y", 0)
                .attr("width", x(range[1] - range[0]))
                .attr("height", height)
                .attr("fill", theme.color.blue)
                .attr("opacity", 0.15);
        });
    }

    if (untrustworthyRanges.length) {
        untrustworthyRanges.forEach((range: [number, number]) => {
            svg.append("rect")
                .attr("x", x(range[0]))
                .attr("y", 0)
                .attr("width", x(range[1] - range[0]))
                .attr("height", height)
                .attr("fill", theme.color.red)
                .attr("opacity", 0.4);
        });
    }

    if (data) {
        const areaDrawer = area<number>()
            .x((_, i) => x(i))
            .y0((d) => y(d))
            .y1(height);

        svg.append("path")
            .datum(data)
            .attr("class", "depth-area")
            .attr("d", areaDrawer);

        svg.append("g")
            .attr("transform", "translate(0,0)")
            .call(yAxis)
            .attr("class", "axis");
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .attr("class", "axis");
    }
}

type StyledIimiCoverageChartProps = {
    theme: DefaultTheme;
};

const StyledIimiCoverageChart = styled.div<StyledIimiCoverageChartProps>`
    display: inline-block;
    margin-top: 5px;

    path.untrustworthy-range {
        stroke: ${(props) => props.theme.color.red};
        stroke-width: 1;
    }

    path.depth-area {
        fill: ${(props) => props.theme.color.blue};
    }
`;

interface IimiCoverageChartProps {
    data: number[];
    id: string;
    yMax: number;
    untrustworthyRanges: UntrustworthyRange[];
}

export function CoverageChart({
    data,
    id,
    yMax,
    untrustworthyRanges,
}: IimiCoverageChartProps) {
    const chartEl = useRef(null);

    useEffect(() => {
        const length = data.length;
        draw(chartEl.current, data, length, yMax, untrustworthyRanges);
    }, [data, id, yMax]);

    return <StyledIimiCoverageChart ref={chartEl} />;
}
