import { useFuse } from "@app/fuse";
import Label from "@base/Label";
import MultiSelectComboBox from "@base/MultiSelectComboBox";
import type { SubtractionOption } from "@subtraction/types";
import { intersectionWith } from "es-toolkit";

type SubtractionSelectorProps = {
	selected: string[];
	subtractions: SubtractionOption[];
	onChange: (selected: string[]) => void;
};

export default function SubtractionSelector({
	selected,
	subtractions,
	onChange,
}: SubtractionSelectorProps) {
	const [results, term, setTerm] = useFuse<SubtractionOption>(subtractions, [
		"name",
	]);

	const selectedSubtractions = intersectionWith(
		subtractions,
		selected,
		(subtraction, id) => subtraction.id === id,
	);

	function handleChange(next: SubtractionOption[]) {
		onChange(next.map((subtraction) => subtraction.id));
	}

	return (
		<div className="mb-6">
			<MultiSelectComboBox<SubtractionOption>
				label="Subtractions"
				items={results}
				selectedItems={selectedSubtractions}
				onChange={handleChange}
				term={term}
				onTermChange={setTerm}
				itemToKey={(subtraction) => subtraction.id}
				itemToString={(subtraction) => subtraction.name}
				placeholder="Select subtractions"
				renderOption={(subtraction) => (
					<>
						<span className="overflow-hidden text-ellipsis">
							{subtraction.name}
						</span>
						{subtraction.isDefault ? <Label>Default</Label> : null}
					</>
				)}
				renderChip={(subtraction) => (
					<>
						{subtraction.name}
						{subtraction.isDefault ? (
							<span className="text-gray-500">(default)</span>
						) : null}
					</>
				)}
			/>
		</div>
	);
}
