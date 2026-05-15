import type { UntrustworthyRange } from "@analyses/types";
import { deriveTrustworthyRegions } from "@analyses/utils";
import { area, axisBottom, axisLeft, format, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";

function draw(element, data, length, yMax, untrustworthyRanges) {
	select(element).append("svg");

	const margin = {
		top: 5,
		left: 35,
		bottom: 20,
		right: 0,
	};

	const height = 100 - margin.top - margin.bottom;

	const width =
		(length > 800 ? length / 5 : length) - margin.left - margin.right;

	const x = scaleLinear().range([1, width]).domain([0, length]);
	const y = scaleLinear().range([height, 0]).domain([0, yMax]).nice(5);

	const yAxis = axisLeft(y).ticks(5).tickFormat(format(".2s"));
	const xAxis = axisBottom(x).ticks(5).tickFormat(format(".1s"));

	select(element).selectAll("*").remove();

	const svg = select(element)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	const trustworthyRanges = deriveTrustworthyRegions(
		length,
		untrustworthyRanges,
	);

	if (trustworthyRanges.length) {
		trustworthyRanges.forEach((range) => {
			svg
				.append("rect")
				.attr("x", x(range[0]))
				.attr("y", 0)
				.attr("width", x(range[1] - range[0]))
				.attr("height", height)
				.attr("fill", "#0B7FE5")
				.attr("opacity", 0.15);
		});
	}

	if (untrustworthyRanges.length) {
		untrustworthyRanges.forEach((range: [number, number]) => {
			svg
				.append("rect")
				.attr("x", x(range[0]))
				.attr("y", 0)
				.attr("width", x(range[1] - range[0]))
				.attr("height", height)
				.attr("fill", "#E0282E")
				.attr("opacity", 0.4);
		});
	}

	if (data) {
		const areaDrawer = area<number>()
			.x((_, i) => x(i))
			.y0((d) => y(d))
			.y1(height);

		svg
			.append("path")
			.datum(data)
			.attr("class", "depth-area")
			.attr("d", areaDrawer);

		svg
			.append("g")
			.attr("transform", "translate(0,0)")
			.call(yAxis)
			.attr("class", "axis");
		svg
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(xAxis)
			.attr("class", "axis");
	}
}

interface IimiCoverageChartProps {
	data: number[];
	id: string;
	yMax: number;
	untrustworthyRanges: UntrustworthyRange[];
}

export function CoverageChart({
	data,
	id,
	yMax,
	untrustworthyRanges,
}: IimiCoverageChartProps) {
	const chartEl = useRef(null);

	useEffect(() => {
		const length = data.length;
		draw(chartEl.current, data, length, yMax, untrustworthyRanges);
	}, [data, yMax, untrustworthyRanges]);

	return <div className="coverage-chart inline-block mt-1" ref={chartEl} />;
}
