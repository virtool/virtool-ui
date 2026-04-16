import type { FormattedIimiSequence } from "@analyses/types";
import {
	combineUntrustworthyRegions,
	deriveTrustworthyRegions,
	maxSequences,
} from "@analyses/utils";
import { area, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";

function draw(
	element: HTMLElement,
	data,
	length: number,
	yMax: number,
	untrustworthyRanges,
) {
	select(element).append("svg");

	const height = 100;
	const width = length;

	const y = scaleLinear().range([height, 0]).domain([0, yMax]);
	const x = scaleLinear().range([0, width]).domain([1, length]);

	select(element).selectAll("*").remove();

	const svg = select(element)
		.append("svg")
		.attr("height", height)
		.attr("width", "100%")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("preserveAspectRatio", "none")
		.append("g");

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
				.attr("width", x(range[1]) - x(range[0]))
				.attr("height", height)
				.attr("fill", "#0B7FE5")
				.attr("opacity", 0.15);
		});
	}

	if (untrustworthyRanges.length) {
		untrustworthyRanges.forEach((range) => {
			svg
				.append("rect")
				.attr("x", x(range[0]))
				.attr("y", 0)
				.attr("width", x(range[1]) - x(range[0]))
				.attr("height", height)
				.attr("fill", "#E0282E")
				.attr("opacity", 0.4);
		});
	}

	if (data) {
		const areaDrawer = area<number>()
			.x((_d, i) => x(i))
			.y0((d) => y(d))
			.y1(height);

		svg
			.append("path")
			.datum(data)
			.attr("class", "depth-area")
			.attr("d", areaDrawer);
	}
}

interface IimiCoverageChartProps {
	/** The data to be graphed */
	seqs: FormattedIimiSequence[];
}

export function SummaryChart({ seqs }: IimiCoverageChartProps) {
	const chartEl = useRef(null);

	useEffect(() => {
		const filteredSeqs = seqs.filter(Boolean);
		const avgSeq = maxSequences(filteredSeqs.map((seq) => seq.coverage));

		const untrustworthyRanges = combineUntrustworthyRegions(
			seqs.map((sequence) => (sequence ? sequence.untrustworthy_ranges : [])),
		);

		draw(
			chartEl.current,
			avgSeq,
			avgSeq.length,
			Math.max(...avgSeq, 10),
			untrustworthyRanges,
		);
	}, [seqs]);

	return (
		<div
			className="coverage-chart flex mt-1 min-w-50 w-auto grow not-first:ml-2.5"
			ref={chartEl}
		/>
	);
}
