import { theme } from "@app/theme";
import {
    appendLegend,
    createSvg,
    QUALITY_CHART_HEIGHT,
    QUALITY_CHART_MARGIN,
} from "@samples/charting.js";
import { area, axisBottom, axisLeft, line, scaleLinear } from "d3";
import { forEach, map, min, values } from "lodash-es";

const series = [
    { label: "Mean", color: theme.color.red },
    { label: "Median", color: theme.color.blue },
    { label: "Quartile", color: theme.color.green },
    { label: "Decile", color: theme.color.yellow },
];

function getArea(name: string, areaX, y, a, b) {
    return {
        name,
        func: area()
            .x(areaX)
            .y0((d) => y(d[a]))
            .y1((d) => y(d[b])),
    };
}

function getMinQuality(data) {
    return min(map(data, (document) => min(values(document))));
}

/**
 * Generates the lines representing mean and median base quality.
 */
function lineDrawer(data, key, x, y) {
    const column = {
        mean: 0,
        median: 1,
    }[key];

    const generator = line()
        .x((_, i) => x(i))
        .y((d) => y(d[column]));

    return generator(data);
}

export function drawBasesChart(element: HTMLElement, data, baseWidth: number) {
    const svg = createSvg(element, baseWidth);

    const width =
        baseWidth - QUALITY_CHART_MARGIN.left - QUALITY_CHART_MARGIN.right;

    // Set up scales and axes.
    const y = scaleLinear()
        .range([QUALITY_CHART_HEIGHT, 0])
        .domain([getMinQuality(data) - 5, 48]);

    const x = scaleLinear().range([0, width]).domain([0, data.length]);

    function areaX(d, i) {
        return x(i);
    }

    // Define the d3 area functions to render the inter-quartile and upper and
    // lower decile plot areas.
    const areas = [
        getArea("upper", areaX, y, 3, 5),
        getArea("lower", areaX, y, 2, 4),
        getArea("quartile", areaX, y, 2, 3),
    ];

    // Append the areas to the chart.
    forEach(areas, (a) => {
        svg.append("path")
            .attr("d", a.func(data))
            .attr("class", "graph-line")
            .attr(
                "class",
                `quality-area quality-area-${a.name === "quartile" ? "green" : "yellow"}`,
            );
    });

    // Append the median line to the chart. Color is blue.
    svg.append("path")
        .attr("d", lineDrawer(data, "median", x, y))
        .attr("class", "graph-line graph-line-blue");

    // Append the median line to the chart. Color is red.
    svg.append("path")
        .attr("d", lineDrawer(data, "mean", x, y))
        .attr("class", "graph-line graph-line-red");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${QUALITY_CHART_HEIGHT})`)
        .call(axisBottom(x))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("dy", "10px")
        .attr("fill", "black")
        .attr("class", "axis-label")
        .text("Read Position");

    // Append the y-axis to the chart.
    svg.append("g")
        .attr("class", "y axis")
        .call(axisLeft(y))
        .append("text")
        .text("quality")
        .attr("dy", "10px")
        .attr("y", 6)
        .attr("fill", "black")
        .attr("class", "axis-label")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90)");

    appendLegend(svg, width, series, 8);
}
