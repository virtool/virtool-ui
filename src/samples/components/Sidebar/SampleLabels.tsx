import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SideBarSection from "@base/SideBarSection";
import SidebarHeader from "@base/SidebarHeader";
import { useFetchLabels } from "@labels/queries";
import { xor } from "es-toolkit/array";
import SampleLabel from "../Label/SampleLabel";
import SampleSidebarList from "./SampleSidebarList";
import SampleSidebarSelector from "./SampleSidebarSelector";

type SampleLabelsProps = {
	/** List of label ids associated with the sample */
	sampleLabels: number[];
	/** Callback function to handle label selection */
	onUpdate: (labels: number[]) => void;
};

/**
 * Displays a sidebar to manage sample labels
 */
export default function SampleLabels({
	sampleLabels,
	onUpdate,
}: SampleLabelsProps) {
	const { data, isPending } = useFetchLabels();

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<SideBarSection>
			<SidebarHeader>
				Labels
				<SampleSidebarSelector
					render={({ name, color }) => (
						<SampleLabel name={name} color={color} size="sm" />
					)}
					items={data}
					selectedIds={sampleLabels}
					onUpdate={(labelId: number) => {
						onUpdate(xor(sampleLabels, [labelId]));
					}}
					selectionType="labels"
					manageLink={"/samples/labels"}
				/>
			</SidebarHeader>
			<SampleSidebarList
				items={data.filter((item) => sampleLabels.includes(item.id))}
			/>
			{Boolean(data.length) || (
				<div className="flex text-gray-600 [&_a]:ml-1 [&_a]:text-sm [&_a]:font-medium">
					No labels found. <Link to="/samples/labels">Create one</Link>.
				</div>
			)}
		</SideBarSection>
	);
}
