interface CreateAnalysisSummaryProps {
	indexCount: number;
	sampleCount: number;
}

export function CreateAnalysisSummary({
	indexCount,
	sampleCount,
}: CreateAnalysisSummaryProps) {
	const product = indexCount * sampleCount;

	if (product === 0) {
		return <div className="m-0 text-left" />;
	}

	return (
		<div className="m-0 text-left">
			{product} job
			{product === 1 ? "" : "s"} will be started
		</div>
	);
}
