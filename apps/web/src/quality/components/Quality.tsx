import { useElementSize } from "@app/hooks";
import type { RefObject } from "react";
import { drawBasesChart } from "./Bases";
import { drawNucleotidesChart } from "./Nucleotides";
import { SampleChart } from "./SampleChart";
import { drawSequencesChart } from "./Sequences";

export function Quality({ bases, composition, sequences }) {
	const [ref, { width }] = useElementSize();

	return (
		<div ref={ref as RefObject<HTMLDivElement>}>
			{width && (
				<>
					<h5 className="flex justify-between text-base">
						<strong>Quality Distribution at Read Positions</strong>
					</h5>
					<SampleChart
						createChart={drawBasesChart}
						data={bases}
						width={width}
					/>

					<h5 className="flex justify-between text-base">
						<strong>Nucleotide Composition at Read Positions</strong>
					</h5>
					<SampleChart
						createChart={drawNucleotidesChart}
						data={composition}
						width={width}
					/>

					<h5 className="flex justify-between text-base">
						<strong>Read-wise Quality Occurrence</strong>
					</h5>
					<SampleChart
						createChart={drawSequencesChart}
						data={sequences}
						width={width}
					/>
				</>
			)}
		</div>
	);
}
