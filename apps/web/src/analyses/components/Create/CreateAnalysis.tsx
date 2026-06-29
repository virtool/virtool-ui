import { Dialog, DialogTitle } from "@base/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base/Tabs";
import type { HmmSearchResults } from "@hmm/types";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import CreateNuvs from "./CreateNuvs";
import CreatePathoscope from "./CreatePathoscope";
import { getCompatibleWorkflows } from "./workflows";

type CreateAnalysisProps = {
	/** The HMM search results */
	hmms: HmmSearchResults;

	open: boolean;

	setOpen: (open: boolean) => void;

	/** The id of the sample being used */
	sampleId: string;
};

/**
 * Dialog for creating an analysis
 */
export default function CreateAnalysis({
	hmms,
	open,
	setOpen,
	sampleId,
}: CreateAnalysisProps) {
	const compatibleWorkflows = getCompatibleWorkflows(Boolean(hmms.total_count));

	const sampleIds = [sampleId];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<CreateAnalysisDialogContent>
				<DialogTitle>Analyze</DialogTitle>
				<HMMAlert installed={Boolean(hmms.status.task?.complete)} />
				<Tabs defaultValue="pathoscope">
					<TabsList>
						{compatibleWorkflows.map((workflow) => (
							<TabsTrigger key={workflow.id} value={workflow.id}>
								{workflow.name}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value="nuvs">
						<CreateNuvs sampleCount={1} sampleIds={sampleIds} />
					</TabsContent>
					<TabsContent value="pathoscope">
						<CreatePathoscope sampleCount={1} sampleIds={sampleIds} />
					</TabsContent>
				</Tabs>
			</CreateAnalysisDialogContent>
		</Dialog>
	);
}
