import type { PathoscopeSegmentCoverage } from "@virtool/contracts";
import PathoscopeCoverageChart, {
	type CoveragePanel,
} from "./PathoscopeCoverageChart";

const height = 80;

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
	// A single-segment OTU is the unsegmented case, where a label would only repeat
	// what the accordion already says. An undetected segment is labelled whatever
	// the count, because it draws nothing and a blank panel needs its reason.
	const labelled =
		segments.length > 1 || segments.some((segment) => !segment.detected);

	const description =
		segments.length > 1
			? `Read depth across each of the ${segments.length} segments of the reference genome`
			: "Read depth across the reference genome";

	const panels: CoveragePanel[] = segments.map((segment) => ({
		align: segment.align,
		key: segment.key,
		label: labelled ? labelOf(segment) : "",
		length: segment.length,
	}));

	return (
		<PathoscopeCoverageChart
			description={description}
			height={height}
			maxDepth={maxDepth}
			panels={panels}
		/>
	);
}
