import type { FormattedIimiSequence } from "@analyses/types";
import Box from "@base/Box";
import { sortBy } from "es-toolkit";
import { CoverageChart } from "../Charts/CoverageChart";
import { IimiDetection } from "./IimiDetection";

type IimiIsolateProps = {
	name: string;
	sequences: FormattedIimiSequence[];
};

/**
 * a single iimi isolate item
 */
export function IimiIsolate({ name, sequences }: IimiIsolateProps) {
	const sorted = sortBy(sequences, [(sequence) => sequence.length]);

	return (
		<div>
			<h5>{name}</h5>
			<div className="flex items-center gap-4 overflow-x-scroll">
				{sorted.map((sequence) => (
					<Box key={sequence.id}>
						<p>
							<IimiDetection
								probability={sequence.probability}
								result={sequence.result}
							/>
						</p>
						<CoverageChart
							data={sequence.coverage}
							id={sequence.id}
							yMax={Math.max(sequence.maxDepth, 10)}
							untrustworthyRanges={sequence.untrustworthy_ranges}
						/>
					</Box>
				))}
			</div>
		</div>
	);
}
