import { pluralize } from "@app/format";
import { labelSvg } from "@samples/charting";
import type { Coordinate } from "@virtool/contracts";
import { area, axisBottom, axisLeft, format, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";
import "./area.css";
import { chartHeight, chartMargin } from "./columns";

type DrawParams = {
	data: Coordinate[] | null;
	element: HTMLElement;
	label: string;

	/** The span the horizontal axis covers — the segment, not this sequence */
	segmentLength: number;

	width: number;
	yMax: number;
};

function draw({
	data,
	element,
	label,
	segmentLength,
	width,
	yMax,
}: DrawParams) {
	// The axis spans the segment rather than this sequence, so a sequence shorter
	// than the longest filling the segment stops short of the column's edge
	// instead of being stretched across it.
	const x = scaleLinear().range([0, width]).domain([0, segmentLength]);
	const y = scaleLinear().range([chartHeight, 0]).domain([0, yMax]);

	select(element).selectAll("*").remove();

	const svgRoot = select(element)
		.append("svg")
		.attr("width", width + chartMargin)
		.attr("height", chartHeight + chartMargin);

	labelSvg(svgRoot, label);

	const svg = svgRoot
		.append("g")
		.attr("transform", `translate(${chartMargin},5)`);

	if (data) {
		const areaDrawer = area<Coordinate>()
			.x((d) => x(d[0]))
			.y0((d) => y(d[1]))
			.y1(chartHeight);

		svg
			.append("path")
			.datum(data)
			.attr("class", "depth-area")
			.attr("d", areaDrawer);
	}

	// Set up a y-axis that will appear at the top of the chart.
	svg
		.append("g")
		.attr("class", "x axis")
		.attr("transform", `translate(0,${chartHeight})`)
		.call(axisBottom(x).ticks(10))
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-0.8em")
		.attr("dy", "0.15em")
		.attr("transform", "rotate(-65)");

	svg
		.append("g")
		.attr("class", "y axis")
		.call(axisLeft(y).ticks(4).tickFormat(format(".0s")));
}

type CoverageChartProps = {
	accession: string;
	data: Coordinate[] | null;
	definition: string;
	length: number;

	/** The span the horizontal axis covers — the segment, not this sequence */
	segmentLength: number;

	/** The width of the column, shared with every other isolate's */
	width: number;

	yMax: number;
};

export default function PathoscopeSequence({
	accession,
	data,
	definition,
	length,
	segmentLength,
	width,
	yMax,
}: CoverageChartProps) {
	const chartEl = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (chartEl.current) {
			draw({
				data,
				element: chartEl.current,
				label: `Read depth coverage across the ${accession} sequence, ${pluralize(length, "nucleotide")} long.`,
				segmentLength,
				width,
				yMax,
			});
		}
	}, [accession, data, length, segmentLength, width, yMax]);

	return (
		<div className="bg-stone-50 inline-block rounded">
			<p className="font-medium m-0 p-4 r-1 text-base text-gray-800">
				{accession} - {definition}
			</p>
			<div ref={chartEl}></div>
		</div>
	);
}
