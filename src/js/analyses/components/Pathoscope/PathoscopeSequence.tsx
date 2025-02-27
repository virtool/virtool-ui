import { area, axisBottom, axisLeft, format, scaleLinear, select } from "d3";
import React, { useEffect, useRef } from "react";

type DrawParams = {
    element: HTMLElement;
    data: number[];
    length: number;
    yMax: number;
    xMin: number;
    maxGenomeLength: number;
    ratio: number;
};

function draw({
    element,
    data,
    length,
    yMax,
    xMin,
    maxGenomeLength,
    ratio,
}: DrawParams) {
    select(element).append("svg");

    const margin = 50;
    const height = 120;

    let width = maxGenomeLength > 800 ? maxGenomeLength / 5 : maxGenomeLength;

    if (width < xMin) {
        width = xMin;
    }

    width *= ratio;

    console.table({
        width,
        xMin,
        maxGenomeLength,
        ratio,
    });

    const x = scaleLinear().range([0, width]).domain([0, length]);
    const y = scaleLinear().range([height, 0]).domain([0, yMax]);

    select(element).selectAll("*").remove();

    const svg = select(element)
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append("g")
        .attr("transform", `translate(${margin},5)`);

    if (data) {
        const areaDrawer = area<number>()
            .x((d) => x(d[0]))
            .y0((d) => y(d[1]))
            .y1(height);

        svg.append("path")
            .datum(data)
            .attr("class", "depth-area")
            .attr("d", areaDrawer);
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
}

type CoverageChartProps = {
    accession: string;
    data: number[];
    definition: string;
    id: string;
    length: number;
    maxGenomeLength: number;
    ratio: number;
    yMax: number;
};

export default function PathoscopeSequence({
    accession,
    data,
    definition,
    id,
    length,
    maxGenomeLength,
    ratio,
    yMax,
}: CoverageChartProps) {
    console.log(maxGenomeLength);

    const chartEl = useRef(null);

    useEffect(() => {
        draw({
            element: chartEl.current,
            data,
            length,
            yMax,
            xMin: chartEl.current.offsetWidth,
            maxGenomeLength,
            ratio,
        });
    }, [accession, data, definition, id, length, maxGenomeLength, ratio, yMax]);

    return (
        <div className="bg-stone-50 inline-block rounded">
            <p className="font-medium m-0 p-4 r-1 text-base text-gray-800">
                {accession} - {definition}
            </p>
            <div ref={chartEl}></div>
        </div>
    );
}
