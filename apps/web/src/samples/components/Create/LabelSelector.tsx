import { useFuse } from "@app/fuse";
import Circle from "@base/Circle";
import Link from "@base/Link";
import MultiSelectComboBox from "@base/MultiSelectComboBox";
import type { Label } from "@labels/types";
import { intersectionWith } from "es-toolkit";
import SampleLabel from "../Label/SampleLabel";

type LabelSelectorProps = {
	/** All labels available for selection */
	labels: Label[];

	/** The ids of the currently selected labels */
	selected: number[];

	/** Called with the next selection when a label is added or removed */
	onChange: (selected: number[]) => void;
};

/**
 * A combobox for selecting the labels to apply to a new sample.
 */
export default function LabelSelector({
	labels,
	selected,
	onChange,
}: LabelSelectorProps) {
	const [results, term, setTerm] = useFuse<Label>(labels, ["name"]);

	const selectedLabels = intersectionWith(
		labels,
		selected,
		(label, id) => label.id === id,
	);

	function handleChange(next: Label[]) {
		onChange(next.map((label) => label.id));
	}

	return (
		<div className="mb-6">
			<MultiSelectComboBox<Label>
				label="Labels"
				items={results}
				selectedItems={selectedLabels}
				onChange={handleChange}
				term={term}
				onTermChange={setTerm}
				itemToKey={(label) => String(label.id)}
				itemToString={(label) => label.name}
				placeholder="Select labels"
				renderOption={(label) => (
					<SampleLabel name={label.name} color={label.color} size="sm" />
				)}
				renderChip={(label) => (
					<>
						<Circle
							style={{
								color: label.color.startsWith("#")
									? label.color
									: `#${label.color}`,
							}}
						/>
						{label.name}
					</>
				)}
			/>
			{Boolean(labels.length) || (
				<div className="flex mt-2 text-gray-600 [&_a]:ml-1 [&_a]:text-sm [&_a]:font-medium">
					No labels found. <Link to="/samples/labels">Create one</Link>.
				</div>
			)}
		</div>
	);
}
