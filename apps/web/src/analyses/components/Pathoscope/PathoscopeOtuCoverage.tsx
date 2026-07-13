import { downsampleDepths } from "@analyses/utils";
import { useElementSize } from "@app/hooks";
import { area, max, scaleLinear } from "d3";

const height = 60;

function buildDepthPath(filled: number[], width: number): string {
	const depths = downsampleDepths(filled, width);

	const x = scaleLinear().range([0, width]).domain([0, depths.length]);
	const y = scaleLinear()
		.range([height, 0])
		.domain([0, max(depths) || 1]);

	const path = area<number>()
		.x((_, index) => x(index))
		.y0(height)
		.y1((depth) => y(depth));

	return path(depths) ?? "";
}

type OtuCoverageProps = {
	filled: number[];
};

export default function PathoscopeOtuCoverage({ filled }: OtuCoverageProps) {
	const [ref, { width }] = useElementSize<HTMLDivElement>();

	const d = width > 0 ? buildDepthPath(filled, width) : "";

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
