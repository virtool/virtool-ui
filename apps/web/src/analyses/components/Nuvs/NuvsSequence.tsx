import { pluralize } from "@app/format";
import { labelSvg } from "@samples/charting";
import { axisTop, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";

function draw(element: HTMLElement, maxLength: number, sequenceLength: number) {
	element.innerHTML = "";

	const width = element.offsetWidth;

	const x = scaleLinear()
		.range([0, width - 30])
		.domain([0, maxLength]);

	const label = `Sequence ruler: a ${sequenceLength} nucleotide sequence on a scale up to ${pluralize(maxLength, "nucleotide")}.`;

	// Construct the SVG canvas.
	const svg = select(element)
		.append("svg")
		.attr("width", width)
		.attr("height", 30);

	labelSvg(svg, label);

	// Create a group that will hold all chart elements.
	const group = svg.append("g").attr("transform", "translate(15,3)");

	group
		.append("rect")
		.attr("x", 0)
		.attr("y", 18)
		.attr("width", x(sequenceLength))
		.attr("height", 8);

	group
		.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,16)")
		.call(axisTop(x));
}

export default function NuvsSequence({ maxSequenceLength, sequence }) {
	const chartEl = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (chartEl.current) {
			draw(chartEl.current, maxSequenceLength, sequence.length);
		}
	}, [maxSequenceLength, sequence]);

	return (
		<div className="overflow-hidden">
			<div className="my-4" ref={chartEl} />
		</div>
	);
}
