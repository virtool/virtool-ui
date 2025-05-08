import { theme } from "@app/theme";
import { area, scaleLinear, select } from "d3";
import React, { useEffect, useRef } from "react";
import styled, { DefaultTheme } from "styled-components";
import { UntrustworthyRange } from "../../types";
import { deriveTrustworthyRegions } from "../../utils";

function draw(
    element: HTMLElement,
    data,
    length: number,
    yMax: number,
    untrustworthyRanges,
) {
    select(element).append("svg");

    const height = 100;
    const width = length;

    const y = scaleLinear().range([height, 0]).domain([0, yMax]);
    const x = scaleLinear().range([0, width]).domain([1, length]);

    select(element).selectAll("*").remove();

    const svg = select(element)
        .append("svg")
        .attr("height", height)
        .attr("width", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "none")
        .append("g");

    const trustworthyRanges = deriveTrustworthyRegions(
        length,
        untrustworthyRanges,
    );

    if (trustworthyRanges.length) {
        trustworthyRanges.forEach((range) => {
            svg.append("rect")
                .attr("x", x(range[0]))
                .attr("y", 0)
                .attr("width", x(range[1]) - x(range[0]))
                .attr("height", height)
                .attr("fill", theme.color.blue)
                .attr("opacity", 0.15);
        });
    }

    if (untrustworthyRanges.length) {
        untrustworthyRanges.forEach((range) => {
            svg.append("rect")
                .attr("x", x(range[0]))
                .attr("y", 0)
                .attr("width", x(range[1]) - x(range[0]))
                .attr("height", height)
                .attr("fill", theme.color.red)
                .attr("opacity", 0.4);
        });
    }

    if (data) {
        const areaDrawer = area<number>()
            .x((d, i) => x(i))
            .y0((d) => y(d))
            .y1(height);

        svg.append("path")
            .datum(data)
            .attr("class", "depth-area")
            .attr("d", areaDrawer);
    }
}

type StyledIimiCoverageChartProps = {
    theme: DefaultTheme;
};

const StyledIimiCoverageChart = styled.div<StyledIimiCoverageChartProps>`
    display: flex;
    margin-top: 5px;
    min-width: 200px;
    width: auto;
    flex-grow: 1;

    &:not(:first-child) {
        margin-left: 10px;
    }

    path.untrustworthy-range {
        stroke: ${(props) => props.theme.color.red};
        stroke-width: 1;
    }

    path.depth-area {
        fill: ${(props) => props.theme.color.blue};
    }
`;

interface IimiCoverageChartProps {
    /** The data to be graphed */
    data: number[];
    /** The unique identifier of the data being graphed */
    id: string;
    /** The maximum number of reads that will be shown on the y axis */
    yMax: number;
    /** regions of the sequence that are untrustworthy annotated by bp position*/
    untrustworthyRanges: UntrustworthyRange[];
}

export function SummaryChart({
    data,
    id,
    yMax,
    untrustworthyRanges,
}: IimiCoverageChartProps) {
    const chartEl = useRef(null);

    useEffect(() => {
        draw(chartEl.current, data, data.length, yMax, untrustworthyRanges);
    }, [data, id, yMax]);

    return <StyledIimiCoverageChart ref={chartEl} />;
}
