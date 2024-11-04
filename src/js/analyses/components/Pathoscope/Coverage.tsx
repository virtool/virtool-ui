import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { area } from "d3-shape";
import React, { useEffect, useRef } from "react";
import styled, { DefaultTheme } from "styled-components";

function draw(element, data, length, meta, yMax, xMin, graphWidth, graphRatio) {
    select(element).append("svg");

    const margin = {
        top: 10,
        left: 35,
        bottom: 50,
        right: 10,
    };

    const height = 200 - margin.top - margin.bottom;

    let width = graphWidth > 800 ? graphWidth / 5 : graphWidth;

    if (width < xMin) {
        width = xMin;
    }

    if (graphRatio) {
        width = width * graphRatio;
    }

    width -= margin.left + margin.right;

    const x = scaleLinear().range([0, width]).domain([0, length]);
    const y = scaleLinear().range([height, 0]).domain([0, yMax]);

    select(element).selectAll("*").remove();

    // Construct the SVG canvas.
    const svg = select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 5)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top + 5})`);

    if (data) {
        const areaDrawer = area()
            .x(d => x(d[0]))
            .y0(d => y(d[1]))
            .y1(height);

        svg.append("path").datum(data).attr("class", "depth-area").attr("d", areaDrawer);
    }

    // Set up a y-axis that will appear at the top of the chart.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(axisBottom(x).ticks(10))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-65)");

    svg.append("g")
        .attr("class", "y axis")
        .call(axisLeft(y).ticks(4).tickFormat(format(".0s")));

    select(element)
        .append("p")
        .attr("class", "coverage-label small")
        .style("position", "relative")
        .style("bottom", `${height + margin.top + margin.bottom + 15}px`)
        .style("left", `${margin.left}px`)
        .style("padding", "5px")
        .style("margin", "0")
        .style("color", "#71717a")
        .text(`${meta.accession} - ${meta.definition}`);
}

type StyledCoverageChartProps = {
    theme: DefaultTheme;
};

const StyledCoverageChart = styled.div<StyledCoverageChartProps>`
    display: inline-block;
    margin-top: 5px;

    path.depth-area {
        fill: ${props => props.theme.color.blue};
        stroke: ${props => props.theme.color.blue};
    }
`;

interface CoverageChartProps {
    accession: string;
    data: any;
    definition: string;
    id: string;
    length: number;
    yMax: number;
    graphWidth: number;
    graphRatio: number;
}

export default function CoverageChart({
    accession,
    data,
    definition,
    id,
    length,
    yMax,
    graphWidth,
    graphRatio,
}: CoverageChartProps) {
    const chartEl = useRef(null);

    useEffect(() => {
        draw(
            chartEl.current,
            data,
            length,
            { accession, id, definition },
            yMax,
            chartEl.current.offsetWidth,
            graphWidth,
            graphRatio,
        );
    }, [id]);

    return <StyledCoverageChart ref={chartEl} />;
}
