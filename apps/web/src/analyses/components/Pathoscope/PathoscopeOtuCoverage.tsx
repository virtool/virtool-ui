import { useElementSize } from "@app/hooks";
import type { Coordinate, PathoscopeSegmentCoverage } from "@virtool/contracts";
import { area, scaleLinear } from "d3";

const height = 60;

/** The horizontal space left between one segment's panel and the next. */
const gap = 6;

/**
 * Reduce the polyline to at most one point per pixel, keeping the deepest point
 * in each column.
 *
 * The server caps a curve at a point count wide enough for any chart, not for
 * this one — the overview splits its width across a genome's segments, so a
 * panel is a fraction of that. Every hit draws this overview in its accordion
 * trigger, so an analysis with many OTUs would otherwise put far more segments
 * in the document than can be seen while all of them are still collapsed.
 *
 * This is the same reduction the server applies, run again at the width actually
 * being drawn. The two cannot share a module: server code must not be reachable
 * from the browser tree.
 *
 * A column reports its deepest point, so peaks survive at the position they
 * were recorded at.
 */
function downsample(
	align: Coordinate[],
	length: number,
	width: number,
): Coordinate[] {
	if (align.length <= width) {
		return align;
	}

	const columns = new Map<number, Coordinate>();

	for (const point of align) {
		const column = Math.min(Math.floor((point[0] / length) * width), width - 1);
		const peak = columns.get(column);

		if (peak === undefined || point[1] > peak[1]) {
			columns.set(column, point);
		}
	}

	// The points arrive in ascending x, and replacing a column's peak keeps that
	// column's insertion position, so the values are already in order.
	return [...columns.values()];
}

function buildDepthPath(
	align: Coordinate[],
	length: number,
	width: number,
	maxDepth: number,
): string {
	const points = downsample(align, length, width);

	const x = scaleLinear().range([0, width]).domain([0, length]);

	// Every segment of an OTU is drawn against the deepest point in any of them,
	// so their heights can be read against each other. Scaling each to its own
	// peak would draw a segment with a handful of reads as tall as one with
	// thousands.
	const y = scaleLinear()
		.range([height, 0])
		.domain([0, maxDepth || 1]);

	const path = area<Coordinate>()
		.x((point) => x(point[0]))
		.y0(height)
		.y1((point) => y(point[1]));

	return path(points) ?? "";
}

/** One segment's panel: the curve to draw, and where along the chart it sits. */
type Panel = {
	offset: number;
	segment: PathoscopeSegmentCoverage;
	width: number;
};

// Each segment takes the share of the chart its length is of the whole genome,
// so a position is the same number of nucleotides wide in every panel and the
// segments can be read against each other.
function layOutPanels(
	segments: PathoscopeSegmentCoverage[],
	width: number,
): Panel[] {
	const total = segments.reduce((sum, segment) => sum + segment.length, 0);

	if (total === 0) {
		return [];
	}

	const available = Math.max(0, width - gap * (segments.length - 1));

	let offset = 0;

	return segments.map((segment) => {
		const panel = {
			offset,
			segment,
			width: (available * segment.length) / total,
		};

		offset += panel.width + gap;

		return panel;
	});
}

function formatLength(length: number): string {
	return length >= 1000 ? `${(length / 1000).toFixed(1)} kb` : `${length} nt`;
}

// A named segment is labelled with its name. One matched to its neighbours by
// length is labelled with that length, approximately — the sequences filling it
// differ, and the label says so rather than implying a figure it does not have.
//
// A segment nothing mapped to draws no curve, so its label has to carry the
// reason. An empty panel on its own reads as a gap in the layout.
function labelOf(segment: PathoscopeSegmentCoverage): string {
	const label = segment.name ?? `≈${formatLength(segment.length)}`;

	return segment.detected ? label : `${label} · no reads`;
}

type OtuCoverageProps = {
	/** The greatest depth recorded on any nucleotide of the OTU */
	maxDepth: number;

	/** The OTU's genome segments, in the order they should be drawn */
	segments: PathoscopeSegmentCoverage[];
};

export default function PathoscopeOtuCoverage({
	maxDepth,
	segments,
}: OtuCoverageProps) {
	const [ref, { width }] = useElementSize<HTMLDivElement>();

	const panels = width > 0 ? layOutPanels(segments, width) : [];

	// A single-segment OTU is the unsegmented case, where a label would only repeat
	// what the accordion already says. An undetected segment is labelled whatever
	// the count, because it draws nothing and a blank panel needs its reason.
	const labelled =
		panels.length > 1 || panels.some((panel) => !panel.segment.detected);

	const description =
		segments.length > 1
			? `Read depth across each of the ${segments.length} segments of the reference genome`
			: "Read depth across the reference genome";

	// The border and padding sit on the outer element and the width is measured on
	// the inner one, because `useElementSize` reports `offsetWidth` — a border-box
	// figure. Measuring the bordered element would size the chart to two pixels
	// wider than the box it has to fit inside.
	return (
		<div className="bg-blue-100 border border-blue-200 pt-2 rounded-sm">
			<div ref={ref}>
				<svg width={width} height={height} role="img" aria-label={description}>
					<title>{description}</title>
					{panels.map((panel) => {
						const d = buildDepthPath(
							panel.segment.align,
							panel.segment.length,
							panel.width,
							maxDepth,
						);

						return d ? (
							<path
								className="fill-blue-500"
								d={d}
								key={panel.segment.name ?? panel.offset}
								transform={`translate(${panel.offset},0)`}
							/>
						) : null;
					})}
				</svg>
				{labelled && (
					<div className="flex text-gray-600 text-xs" style={{ gap }}>
						{panels.map((panel) => (
							<span
								className="truncate"
								key={panel.segment.name ?? panel.offset}
								style={{ width: panel.width }}
							>
								{labelOf(panel.segment)}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
