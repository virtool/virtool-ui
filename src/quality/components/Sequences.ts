import { toScientificNotation } from "../../app/utils.js";
import { theme } from "../../app/theme";
import {
    createSvg,
    QUALITY_CHART_HEIGHT,
    QUALITY_CHART_MARGIN,
} from "../../samples/charting.js";
import { axisBottom, axisLeft, line, scaleLinear } from "d3";
import { max } from "lodash-es";

export function drawSequencesChart(element, data, baseWidth) {
    const svg = createSvg(element, baseWidth);

    const width =
        baseWidth - QUALITY_CHART_MARGIN.right - QUALITY_CHART_MARGIN.left;

    // Set up scales.
    const y = scaleLinear()
        .range([QUALITY_CHART_HEIGHT, 0])
        .domain([0, max(data)]);

    const x = scaleLinear().range([0, width]).domain([0, data.length]);

    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y).tickFormat(toScientificNotation);

    const lineDrawer = line<number>()
        .x((d, i) => x(i))
        .y((d) => y(d));

    // Append the plot line to the SVG.
    svg.append("path")
        .attr("d", lineDrawer(data))
        .attr("class", "graph-line")
        .attr("stroke", theme.color.greyDark);

    // Append a labelled x-axis to the SVG.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${QUALITY_CHART_HEIGHT})`)
        .call(xAxis)
        .append("text")
        .attr("y", "30")
        .attr("x", width / 2)
        .attr("dy", "10px")
        .attr("class", "axis-label")
        .attr("fill", "black")
        .text("Read quality");

    // Append a labelled y-axis to the SVG. The label is on the plot-side of the axis and is oriented vertically.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "10px")
        .attr("fill", "black")
        .attr("class", "axis-label")
        .style("text-anchor", "end")
        .text("Read Count");
}
