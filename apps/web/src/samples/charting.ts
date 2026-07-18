import { type Selection, select } from "d3";

export const QUALITY_CHART_HEIGHT = 300;

export const QUALITY_CHART_MARGIN = {
	top: 20,
	left: 60,
	bottom: 60,
	right: 20,
};

export function appendLegend(
	svg: Selection<SVGGElement, unknown, null, undefined>,
	width: number,
	series: { color: string; label: string }[],
	legendCircleRadius: number,
) {
	series.forEach((serie, index) => {
		svg
			.append("circle")
			.attr("cy", index * 25)
			.attr("r", legendCircleRadius)
			.attr("class", "legendOrdinal")
			.attr("transform", `translate(${width - 60}, 5)`)
			.attr("fill", serie.color);
		svg
			.append("text")
			.attr("y", index * 25 + 6)
			.attr("x", 17)
			.attr("class", "legendOrdinal")
			.attr("transform", `translate(${width - 60}, 5)`)
			.text(serie.label);
	});
}

/**
 * Give a d3-built `<svg>` a text alternative: `role="img"` plus an `aria-label`
 * and a matching `<title>`. The role makes the SVG an atomic graphic, hiding
 * its visual axis and legend text from the accessibility tree so the label is
 * the whole alternative; the `<title>` is the equivalent for pointer hover and
 * older assistive technology.
 */
export function labelSvg(
	svg: Selection<SVGSVGElement, unknown, null, undefined>,
	label: string,
) {
	svg.attr("role", "img").attr("aria-label", label);
	svg.append("title").text(label);
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
		);

	labelSvg(svg, label);

	return svg
		.append("g")
		.attr(
			"transform",
			`translate(${QUALITY_CHART_MARGIN.left}, ${QUALITY_CHART_MARGIN.top})`,
		);
}
