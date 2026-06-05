import ContainerSide from "@base/ContainerSide";
import SideBarSection from "@base/SideBarSection";
import SidebarHeader from "@base/SidebarHeader";
import Switch from "@base/Switch";
import type { Label } from "@labels/types";
import DefaultSubtractions from "../Sidebar/DefaultSubtractions";
import SampleLabels from "../Sidebar/SampleLabels";

type SidebarProps = {
	labels: Label[];
	sampleLabels: number[];
	defaultSubtractions: string[];
	showMetadata: boolean;
	onShowMetadataChange: (show: boolean) => void;
	onUpdate: (key: string, value: string[] | number[]) => void;
};

export default function Sidebar({
	labels,
	sampleLabels,
	defaultSubtractions,
	showMetadata,
	onShowMetadataChange,
	onUpdate,
}: SidebarProps) {
	return (
		<ContainerSide className="flex items-stretch flex-col z-10">
			<SideBarSection>
				<SidebarHeader>
					Metadata
					<Switch
						aria-label="Show metadata fields"
						checked={showMetadata}
						onCheckedChange={onShowMetadataChange}
					/>
				</SidebarHeader>
				<p className="text-gray-600 text-sm mb-0">
					Show fields for locale, isolate, and host.
				</p>
			</SideBarSection>
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
