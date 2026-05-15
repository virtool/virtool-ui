import { toThousand } from "@app/utils";
import Box from "@base/Box";
import Label from "@base/Label";
import Link from "@base/Link";
import numbro from "numbro";
import { Bars } from "../Viewer/Bars";

export function AnalysisMappingReferenceTitle({ index, reference }) {
	return (
		<div className="flex items-center [&_a]:mr-1">
			<Link to={`/refs/${reference.id}`}>{reference.name}</Link>
			<Label>{index.version}</Label>
		</div>
	);
}

export function AnalysisMappingSubtractionTitle({ subtractions }) {
	return subtractions.map((subtraction, index) => (
		<span key={subtraction.id}>
			<Link to={`/subtractions/${subtraction.id}`}>{subtraction.name}</Link>
			{index !== subtractions.length - 1 ? ", " : ""}
		</span>
	));
}

export function AnalysisMapping({ totalReads, detail }) {
	const { index, reference, subtractions, results } = detail;
	const { readCount, subtractedCount } = results;

	const totalMapped = readCount + subtractedCount;
	const sumPercent = readCount / totalReads;

	const legend = [
		{
			color: "blue",
			count: readCount,
			title: (
				<AnalysisMappingReferenceTitle index={index} reference={reference} />
			),
		},
	];

	if (subtractions.length > 0) {
		legend.push({
			color: "orange",
			count: subtractedCount,
			title: <AnalysisMappingSubtractionTitle subtractions={subtractions} />,
		});
	}

	return (
		<Box className="mb-8">
			<h3 className="flex items-end justify-between text-2xl font-normal my-4 mb-2.5">
				{numbro(sumPercent).format({ output: "percent", mantissa: 2 })} mapped
				<small className="text-gray-500 text-base font-semibold">
					{toThousand(readCount)} of {toThousand(totalReads)} reads
				</small>
			</h3>

			<Bars empty={totalReads - totalMapped} items={legend} />
		</Box>
	);
}
