import { cn } from "@app/utils";
import Badge from "@base/Badge";
import BoxGroupSection from "@base/BoxGroupSection";
import { Dialog, DialogTitle } from "@base/Dialog";
import QueryError from "@base/QueryError";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base/Tabs";
import { useListHmms } from "@hmm/queries";
import type { SampleMinimal } from "@samples/types";
import { useEffect } from "react";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";
import CreateNuvs from "./CreateNuvs";
import CreatePathoscope from "./CreatePathoscope";
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

				<Tabs defaultValue="pathoscope">
					<TabsList className="mb-4">
						{compatibleWorkflows.map((workflow) => (
							<TabsTrigger key={workflow.id} value={workflow.id}>
								{workflow.name}
							</TabsTrigger>
						))}
					</TabsList>
					<CreateAnalysisFieldTitle>
						Compatible Samples <Badge>{samples.length}</Badge>
					</CreateAnalysisFieldTitle>
					<div
						className={cn(
							"border",
							"border-gray-300",
							"mb-4",
							"max-h-32",
							"overflow-y-scroll",
							"rounded-sm",
						)}
					>
						{samples.map(({ id, name }) => (
							<BoxGroupSection key={id} disabled>
								{name}
							</BoxGroupSection>
						))}
					</div>
					<TabsContent value="nuvs">
						<CreateNuvs sampleCount={sampleIds.length} sampleIds={sampleIds} />
					</TabsContent>
					<TabsContent value="pathoscope">
						<CreatePathoscope
							sampleCount={sampleIds.length}
							sampleIds={sampleIds}
						/>
					</TabsContent>
				</Tabs>
			</CreateAnalysisDialogContent>
		</Dialog>
	);
}
