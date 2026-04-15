import type { LabelNested } from "@labels/types";
import { useUpdateSample } from "@samples/queries";
import type { SubtractionNested } from "@subtraction/types";
import DefaultSubtractions from "../Sidebar/DefaultSubtractions";
import SampleLabels from "../Sidebar/SampleLabels";

type SidebarProps = {
	sampleId: string;
	sampleLabels: Array<LabelNested>;
	defaultSubtractions: Array<SubtractionNested>;
};

/**
 * Displays the sidebar for managing labels and subtractions associated with sample
 */
export default function Sidebar({
	sampleId,
	sampleLabels,
	defaultSubtractions,
}: SidebarProps) {
	const mutation = useUpdateSample(sampleId);

	return (
		<div className="flex flex-col items-stretch w-80 z-0">
			<SampleLabels
				onUpdate={(labels) => {
					mutation.mutate({ update: { labels } });
				}}
				sampleLabels={sampleLabels.map((label) => label.id)}
			/>
			<DefaultSubtractions
				onUpdate={(subtractions) => {
					mutation.mutate({ update: { subtractions } });
				}}
				defaultSubtractions={defaultSubtractions.map(
					(subtraction) => subtraction.id,
				)}
			/>
		</div>
	);
}
