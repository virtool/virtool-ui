import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import { toScientificNotation } from "@app/format";
import ScrollSync from "@base/ScrollSync";
import type {
	PathoscopeSegmentCoverage,
	PathoscopeSequence as PathoscopeSequenceData,
} from "@virtool/contracts";
import { columnWidth } from "./columns";
import PathoscopeSequence from "./PathoscopeSequence";
import PathoscopeSequenceEmpty from "./PathoscopeSequenceEmpty";

type PathoscopeIsolateProps = {
	coverage: number;
	depth: number;

	/** The summed length of the OTU's segments, which fixes the column widths */
	genomeLength: number;

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
	genomeLength,
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
	// own sequences, so every isolate's columns line up and a segment this one has
	// no sequence for leaves its column empty instead of shifting the rest along.
	const columns = segments.map((segment) => {
		const sequence = sequences.find(
			(entry) => entry.segmentKey === segment.key,
		);

		const width = columnWidth(genomeLength, segment.length);

		if (sequence === undefined) {
			return (
				<PathoscopeSequenceEmpty
					key={segment.key}
					name={segment.name}
					width={width}
				/>
			);
		}

		return (
			<PathoscopeSequence
				accession={sequence.accession}
				data={sequence.align}
				definition={sequence.definition}
				key={segment.key}
				length={sequence.length}
				segmentLength={segment.length}
				width={width}
				yMax={maxDepth}
			/>
		);
	});

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
			<ScrollSync className="flex gap-4">{columns}</ScrollSync>
		</div>
	);
}
