import ContainerSide from "@base/ContainerSide";
import type { Label } from "@labels/types";
import DefaultSubtractions from "../Sidebar/DefaultSubtractions";
import SampleLabels from "../Sidebar/SampleLabels";

type SidebarProps = {
	labels: Label[];
	sampleLabels: number[];
	defaultSubtractions: string[];
	onUpdate: (key: string, value: string[] | number[]) => void;
};

export default function Sidebar({
	labels,
	sampleLabels,
	defaultSubtractions,
	onUpdate,
}: SidebarProps) {
	return (
		<ContainerSide className="flex items-stretch flex-col z-10">
			<SampleLabels
				labels={labels}
				onUpdate={(selection) => onUpdate("sidebar.labels", selection)}
				sampleLabels={sampleLabels}
			/>
			<DefaultSubtractions
				onUpdate={(selection) => onUpdate("sidebar.subtractionIds", selection)}
				defaultSubtractions={defaultSubtractions}
			/>
		</ContainerSide>
	);
}
