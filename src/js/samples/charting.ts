import { select } from "d3";
import { keysIn, map } from "lodash-es";

export const QUALITY_CHART_HEIGHT = 300;

export const QUALITY_CHART_MARGIN = {
    top: 20,
    left: 60,
    bottom: 60,
    right: 20,
};

export function appendLegend(
    svg,
    width: number,
    series,
    legendCircleRadius: number,
) {
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
}

export function createSvg(element: HTMLElement, width: number) {
    select(element).selectAll("*").remove();

    return select(element)
        .append("svg")
        .attr(
            "width",
            width + QUALITY_CHART_MARGIN.left + QUALITY_CHART_MARGIN.right,
        )
        .attr(
            "height",
            QUALITY_CHART_HEIGHT +
                QUALITY_CHART_MARGIN.top +
                QUALITY_CHART_MARGIN.bottom,
        )
        .append("g")
        .attr(
            "transform",
            `translate(${QUALITY_CHART_MARGIN.left}, ${QUALITY_CHART_MARGIN.top})`,
        );
}
