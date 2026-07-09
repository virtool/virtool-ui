import { Dialog, DialogTitle } from "@base/Dialog";
import QueryError from "@base/QueryError";
import { useListHmms } from "@hmm/queries";
import type { SampleMinimal } from "@samples/types";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import CreateAnalysisForm from "./CreateAnalysisForm";
import { SelectedSamples } from "./SelectedSamples";
import { getCompatibleWorkflows } from "./workflows";

type QuickAnalyzeProps = {
	open: boolean;
	setOpen: (open: boolean) => void;

	/** The samples to analyze */
	samples: SampleMinimal[];
};

/**
 * A form for triggering quick analyses on the passed samples
 */
export default function QuickAnalyze({
	open,
	samples,
	setOpen,
}: QuickAnalyzeProps) {
	const { data: hmms, isPending, isError } = useListHmms(1, 1, "");

	if (isError && !hmms) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<CreateAnalysisDialogContent>
					<DialogTitle>Quick Analyze</DialogTitle>
					<QueryError noun="HMMs" />
				</CreateAnalysisDialogContent>
			</Dialog>
		);
	}

	if (isPending) {
		return null;
	}

	const compatibleWorkflows = getCompatibleWorkflows(hmms.total_count > 0);

	const sampleIds = samples.map((sample) => sample.id);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<CreateAnalysisDialogContent>
				<DialogTitle>Quick Analyze</DialogTitle>
				<HMMAlert installed={Boolean(hmms.status.task?.complete)} />

				<SelectedSamples samples={samples} />

				<CreateAnalysisForm
					compatibleWorkflows={compatibleWorkflows}
					sampleCount={sampleIds.length}
					sampleIds={sampleIds}
				/>
			</CreateAnalysisDialogContent>
		</Dialog>
	);
}
