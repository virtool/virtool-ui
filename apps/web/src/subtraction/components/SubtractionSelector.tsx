import { cn } from "@app/cn";
import { useFuse } from "@app/fuse";
import Label from "@base/Label";
import Link from "@base/Link";
import MultiSelectComboBox from "@base/MultiSelectComboBox";
import type { SubtractionOption } from "@subtraction/types";
import { intersectionWith } from "es-toolkit";

type SubtractionSelectorProps = {
	/** Overrides the spacing around the combobox */
	className?: string;

	/** Suppresses the "no subtractions yet" hint, which would repeat in a list of rows */
	hideEmptyHint?: boolean;

	/** Hides the label visually, keeping it for assistive technology */
	hideLabel?: boolean;

	/** The ids of the currently selected subtractions */
	selected: string[];

	/** All subtractions available for selection */
	subtractions: SubtractionOption[];

	/** Called with the next selection when a subtraction is added or removed */
	onChange: (selected: string[]) => void;

	/** The combobox's accessible name, which must be unique on the page */
	label?: string;
};

/**
 * A combobox for selecting subtractions.
 */
export default function SubtractionSelector({
	className,
	hideEmptyHint = false,
	hideLabel = false,
	selected,
	subtractions,
	onChange,
	label = "Subtractions",
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
		<div className={cn("mb-6", className)}>
			<MultiSelectComboBox<SubtractionOption>
				label={label}
				hideLabel={hideLabel}
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
			{!subtractions.length && !hideEmptyHint && (
				<div className="flex mt-2 text-gray-600 [&_a]:ml-1 [&_a]:text-sm [&_a]:font-medium">
					No subtractions found. <Link to="/subtractions">Create one</Link>.
				</div>
			)}
		</div>
	);
}
