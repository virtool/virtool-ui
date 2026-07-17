import {
	appendLegend,
	createSvg,
	QUALITY_CHART_HEIGHT,
	QUALITY_CHART_MARGIN,
} from "@samples/charting.js";
import { axisBottom, axisLeft, line, scaleLinear } from "d3";
import { unzip } from "es-toolkit";

const series = [
	{ label: "Guanine", color: "var(--color-blue-600)" },
	{ label: "Adenine", color: "var(--color-red-600)" },
	{ label: "Thymine", color: "var(--color-green-600)" },
	{ label: "Cytosine", color: "var(--color-gray-500)" },
];

export function drawNucleotidesChart(
	element: HTMLElement,
	data: Array<[number, number, number, number]>,
	baseWidth: number,
) {
	const label = `Nucleotide composition across ${data.length} read positions, showing the percentage of guanine, adenine, thymine, and cytosine.`;

	const svg = createSvg(element, baseWidth, label);

	const width =
		baseWidth - QUALITY_CHART_MARGIN.left - QUALITY_CHART_MARGIN.right;

	const y = scaleLinear().range([QUALITY_CHART_HEIGHT, 0]).domain([0, 100]);
	const x = scaleLinear().range([0, width]).domain([0, data.length]);

	// Create a d3 line function for generating the four lines showing nucleotide frequency.
	const lineDrawer = line<number>()
		.x((_, i) => x(i))
		.y((d) => y(d));

	// Append the four plot lines to the SVG.
	unzip(data).forEach((set: number[], index: number) => {
		const serie = series[index];
		if (!serie) {
			return;
		}
		svg
			.append("path")
			.attr("class", "graph-line")
			.attr("d", () => lineDrawer(set))
			.attr("data-legend", () => serie.label)
			.attr("fill", "none")
			.attr("stroke", () => serie.color);
	});

	// Append x-axis and label.
	svg
		.append("g")
		.attr("class", "x axis")
		.attr("transform", `translate(0, ${QUALITY_CHART_HEIGHT})`)
		.call(axisBottom(x))
		.append("text")
		.attr("y", "30")
		.attr("x", width / 2)
		.attr("dy", "10px")
		.attr("class", "axis-label")
		.attr("fill", "black")
		.text("Read Position");

	// Append y-axis and label.
	svg
		.append("g")
		.attr("class", "y axis")
		.call(axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "10px")
		.attr("fill", "black")
		.attr("class", "axis-label")
		.style("text-anchor", "end")
		.text("% Composition");

	appendLegend(svg, width, series, 8);
}
