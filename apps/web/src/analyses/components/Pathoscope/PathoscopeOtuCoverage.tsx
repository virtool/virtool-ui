import { useElementSize } from "@app/hooks";
import type { Coordinate } from "@virtool/contracts";
import { area, max, scaleLinear } from "d3";

const height = 60;

function buildDepthPath(
	align: Coordinate[],
	length: number,
	width: number,
): string {
	const x = scaleLinear().range([0, width]).domain([0, length]);
	const y = scaleLinear()
		.range([height, 0])
		.domain([0, max(align, (point) => point[1]) || 1]);

	const path = area<Coordinate>()
		.x((point) => x(point[0]))
		.y0(height)
		.y1((point) => y(point[1]));

	return path(align) ?? "";
}

type OtuCoverageProps = {
	/** The OTU's isolate curves merged into one polyline */
	align: Coordinate[];

	/** The genome length the polyline spans, which fixes the horizontal scale */
	length: number;
};

export default function PathoscopeOtuCoverage({
	align,
	length,
}: OtuCoverageProps) {
	const [ref, { width }] = useElementSize<HTMLDivElement>();

	const drawable = width > 0 && align.length > 0 && length > 0;
	const d = drawable ? buildDepthPath(align, length, width) : "";

	return (
		<div className="bg-blue-50 pt-2" ref={ref}>
			<svg
				width={width}
				height={height}
				role="img"
				aria-label="Read depth across the reference genome"
			>
				<title>Read depth across the reference genome</title>
				{d && <path className="fill-blue-500" d={d} />}
			</svg>
		</div>
	);
}
