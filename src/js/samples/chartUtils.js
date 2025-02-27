import { select } from "d3";
import { keysIn, map } from "lodash-es";

const height = 300;

const margin = {
    top: 20,
    left: 60,
    bottom: 60,
    right: 20,
};

export const appendLegend = (svg, width, series, legendCircleRadius) => {
    map(keysIn(series), (index) => {
        svg.append("circle")
            .attr("cy", index * 25)
            .attr("r", legendCircleRadius)
            .attr("class", "legendOrdinal")
            .attr("transform", `translate(${width - 60}, 5)`)
            .attr("fill", series[index].color);
        svg.append("text")
            .attr("y", index * 25 + 6)
            .attr("x", 17)
            .attr("class", "legendOrdinal")
            .attr("transform", `translate(${width - 60}, 5)`)
            .text(series[index].label);
    });
};

export const createSVG = (element, width) => {
    select(element).selectAll("*").remove();

    const svg = select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.margin = margin;
    svg.height = height;

    return svg;
};
