import Link from "@base/Link";
import SideBarSection from "@base/SideBarSection";
import SidebarHeader from "@base/SidebarHeader";
import type { Label } from "@labels/types";
import { useUpdateLabel } from "@samples/queries";
import type { SampleMinimal } from "@samples/types";
import { groupBy } from "es-toolkit";
import SampleLabel from "../Label/SampleLabel";
import SampleSidebarMultiselectList from "./SampleSidebarMultiselectList";
import SampleSidebarSelector from "./SampleSidebarSelector";

function getSelectedLabels(document: SampleMinimal[]) {
	const allLabels = document.flatMap((d) => d.labels);
	const grouped = groupBy(allLabels, (label) => label.id);

	return Object.values(grouped).map((labels) => ({
		...labels[0],
		count: labels.length,
		allLabeled: labels.length === document.length,
	}));
}

type ManageLabelsProps = {
	labels: Label[];
	selectedSamples: SampleMinimal[];
};

/**
 * A sidebar to manage labels and filtering samples by labels
 */
export default function ManageLabels({
	labels,
	selectedSamples,
}: ManageLabelsProps) {
	const selectedLabels = getSelectedLabels(selectedSamples);
	const partiallySelectedLabels = selectedLabels.filter(
		(label) => !label.allLabeled,
	);
	const onUpdateLabel = useUpdateLabel(selectedLabels, selectedSamples);

	return (
		<SideBarSection className="row-start-2 self-start">
			<SidebarHeader>
				Manage Labels
				<SampleSidebarSelector
					items={labels}
					manageLink={"/samples/labels"}
					onUpdate={onUpdateLabel}
					partiallySelectedItems={partiallySelectedLabels.map(
						(label) => label.id,
					)}
					selectedIds={selectedLabels.map((label) => label.id)}
					selectionType="labels"
					render={({ name, color }) => (
						<SampleLabel color={color} name={name} size="sm" />
					)}
				/>
			</SidebarHeader>
			<SampleSidebarMultiselectList items={selectedLabels} />
			{Boolean(labels.length) || (
				<div className="flex text-gray-600 [&_a]:ml-1 [&_a]:text-sm [&_a]:font-medium">
					No labels found. <Link to="/samples/labels">Create one</Link>.
				</div>
			)}
		</SideBarSection>
	);
}
