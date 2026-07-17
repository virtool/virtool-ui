import { select } from "d3";

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
	Object.keys(series).forEach((key) => {
		const index = Number(key);
		svg
			.append("circle")
			.attr("cy", index * 25)
			.attr("r", legendCircleRadius)
			.attr("class", "legendOrdinal")
			.attr("transform", `translate(${width - 60}, 5)`)
			.attr("fill", series[index].color);
		svg
			.append("text")
			.attr("y", index * 25 + 6)
			.attr("x", 17)
			.attr("class", "legendOrdinal")
			.attr("transform", `translate(${width - 60}, 5)`)
			.text(series[index].label);
	});
}

export function createSvg(element: HTMLElement, width: number, label: string) {
	select(element).selectAll("*").remove();

	const svg = select(element)
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
		.attr("role", "img")
		.attr("aria-label", label);

	// A screen reader announces the aria-label; the title is the equivalent
	// for pointer hover and older assistive technology. The role="img" makes
	// the SVG an atomic graphic, hiding the visual axis and legend text from
	// the accessibility tree so the label is the whole alternative.
	svg.append("title").text(label);

	return svg
		.append("g")
		.attr(
			"transform",
			`translate(${QUALITY_CHART_MARGIN.left}, ${QUALITY_CHART_MARGIN.top})`,
		);
}
