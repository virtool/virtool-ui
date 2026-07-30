import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import { toScientificNotation } from "@app/format";
import type {
	PathoscopeSegmentCoverage,
	PathoscopeSequence as PathoscopeSequenceData,
} from "@virtool/contracts";
import PathoscopeCoverageChart, {
	type CoveragePanel,
} from "./PathoscopeCoverageChart";

const height = 60;

// A schema segment name identifies the panel across every isolate, so a
// matched sequence is labelled with that rather than its accession where one
// is declared — the accession and definition move into a popover instead,
// alongside every other detail the row doesn't have room for. A segment the
// schema left unnamed has nothing to label it with but the accession itself.
// An unmatched segment names the reason: distinct from the OTU-wide "no
// reads", so this isolate reads as lacking the segment rather than the
// segment being absent everywhere.
function labelOf(
	segment: PathoscopeSegmentCoverage,
	sequence: PathoscopeSequenceData | undefined,
): string {
	if (sequence) {
		return segment.name ?? sequence.accession;
	}

	const name = segment.name ?? "Segment";

	return segment.detected
		? `${name} · not in this isolate`
		: `${name} · no reads`;
}

type PathoscopeIsolateProps = {
	coverage: number;
	depth: number;
	maxDepth: number;
	name: string;
	pi: number;
	reads: number;

	/** The OTU's segments, which the isolate's sequences are laid out against */
	segments: PathoscopeSegmentCoverage[];

	sequences: PathoscopeSequenceData[];
};

export default function PathoscopeIsolate({
	coverage,
	depth,
	maxDepth,
	name,
	pi,
	reads,
	segments,
	sequences,
}: PathoscopeIsolateProps) {
	const { search } = useAnalysisSearch();
	const showReads = search.reads ?? false;

	// The isolate is laid out against the OTU's segments rather than against its
	// own sequences, so every isolate's panels line up and a segment this one has
	// no sequence for leaves its panel empty instead of shifting the rest along.
	const panels: CoveragePanel[] = segments.map((segment) => {
		const sequence = sequences.find(
			(entry) => entry.segmentKey === segment.key,
		);

		return {
			align: sequence?.align ?? null,
			detail: sequence
				? `${sequence.accession} · ${sequence.definition}`
				: undefined,
			key: segment.key,
			label: labelOf(segment, sequence),
			length: segment.length,
		};
	});

	const description =
		segments.length > 1
			? `Read depth across each of the ${segments.length} segments of the ${name} isolate`
			: `Read depth across the ${name} isolate`;

	return (
		<div className="mb-6 relative">
			<div className="flex gap-4 items-end mb-2 text-lg font-medium">
				{name}
				<div className="flex gap-2 text-base">
					<span className="text-green-700">
						{showReads ? reads : toScientificNotation(pi)}
					</span>
					<span className="text-red-700">{depth.toFixed(0)}</span>
					<span className="text-blue-700">
						{toScientificNotation(coverage)}
					</span>
				</div>
			</div>
			{panels.length > 0 && (
				<PathoscopeCoverageChart
					description={description}
					height={height}
					maxDepth={maxDepth}
					panels={panels}
				/>
			)}
		</div>
	);
}
