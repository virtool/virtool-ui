import { useElementSize } from "@utils/hooks";
import { area, max, scaleLinear, select } from "d3";
import React, { useLayoutEffect } from "react";
import "./area.css";

function draw(element: HTMLElement, data: number[], width: number) {
    const height = 60;

    const x = scaleLinear().range([0, width]).domain([0, data.length]);
    const y = scaleLinear()
        .range([height, 0])
        .domain([0, max(data)]);

    select(element).selectAll("*").remove();

    const svg = select(element)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    const areaDrawer = area<number>()
        .x((_, i) => x(i))
        .y0((d) => y(d))
        .y1(height);

    svg.append("path")
        .datum(data)
        .attr("class", "depth-area")
        .attr("d", areaDrawer);
}

type OtuCoverageProps = {
    filled: number[];
};

const PathoscopeOtuCoverage = React.memo<OtuCoverageProps>(({ filled }) => {
    const [ref, { width }] = useElementSize<HTMLDivElement>();

    useLayoutEffect(() => draw(ref.current, filled, width));

    return <div className="bg-blue-50 pt-2" ref={ref} />;
});

PathoscopeOtuCoverage.displayName = "PathoscopeOtuCoverage";

export default PathoscopeOtuCoverage;
