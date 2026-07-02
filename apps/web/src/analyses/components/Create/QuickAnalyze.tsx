import { Dialog, DialogTitle } from "@base/Dialog";
import QueryError from "@base/QueryError";
import { useListHmms } from "@hmm/queries";
import type { SampleMinimal } from "@samples/types";
import { useEffect } from "react";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import CreateAnalysisForm from "./CreateAnalysisForm";
import { SelectedSamples } from "./SelectedSamples";
import { getCompatibleWorkflows } from "./workflows";

type QuickAnalyzeProps = {
	open: boolean;
	/** A callback function to clear selected samples */
	onClear: () => void;
	setOpen: (open: boolean) => void;

	/** The selected samples */
	samples: SampleMinimal[];
};

/**
 * A form for triggering quick analyses on selected samples
 */
export default function QuickAnalyze({
	open,
	samples,
	setOpen,
}: QuickAnalyzeProps) {
	const { data: hmms, isPending, isError } = useListHmms(1, 1, "");

	// The dialog should close when all selected samples have been analyzed and deselected.
	useEffect(() => {
		if (open && samples.length === 0) {
			setOpen(false);
		}
	}, [open, samples, setOpen]);

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
