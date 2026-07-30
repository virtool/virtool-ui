import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import type { PathoscopeHit } from "@virtool/contracts";
import PathoscopeIsolate from "./PathoscopeIsolate";

type PathoscopeDetailProps = {
	/** Complete information for a pathoscope hit */
	hit: PathoscopeHit;

	/** The total number of reads mapped to any OTU during the analysis*/
	mappedCount: number;
};

/** Detailed coverage for a single OTU hits from pathoscope analysis */
export default function PathoscopeDetail({
	hit,
	mappedCount,
}: PathoscopeDetailProps) {
	const { search } = useAnalysisSearch();
	const filterIsolates = search.filterIsolates ?? true;

	const { isolates, pi, segments } = hit;

	const filtered = isolates.filter(
		(isolate) => !filterIsolates || isolate.pi >= 0.03 * pi,
	);

	const isolateComponents = filtered.map((isolate) => {
		return (
			<PathoscopeIsolate
				key={isolate.id}
				coverage={isolate.coverage}
				depth={isolate.depth}
				maxDepth={hit.maxDepth}
				name={isolate.name}
				pi={isolate.pi}
				reads={Math.round(isolate.pi * mappedCount)}
				segments={segments}
				sequences={isolate.sequences}
			/>
		);
	});

	return <div className="pt-4">{isolateComponents}</div>;
}
