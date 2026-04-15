import type { SampleLabel } from "@samples/queries";
import SampleMultiSelectLabel from "../Label/SampleMultiSelectLabel";

type SampleSidebarMultiselectList = {
	/** List of labels that can be used to filter samples */
	items: SampleLabel[];
};

/**
 * Displays a list of labels to filter samples by
 */
export default function SampleSidebarMultiselectList({
	items,
}: SampleSidebarMultiselectList) {
	const sampleItemComponents = items.map(({ id, color, name, allLabeled }) => (
		<SampleMultiSelectLabel
			className="bg-white inline my-1 last:mr-0 mr-2"
			key={id}
			color={color}
			name={name}
			partiallySelected={!allLabeled}
		/>
	));

	return <div className="flex flex-wrap">{sampleItemComponents}</div>;
}
