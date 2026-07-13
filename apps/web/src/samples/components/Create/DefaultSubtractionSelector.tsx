import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import SubtractionSelector from "@subtraction/components/SubtractionSelector";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";

type DefaultSubtractionSelectorProps = {
	/** The ids of the subtractions to use as defaults for the sample */
	selected: string[];

	/** Called with the next selection when a subtraction is added or removed */
	onChange: (selected: string[]) => void;
};

/**
 * A combobox for selecting the default subtractions for a new sample.
 */
export default function DefaultSubtractionSelector({
	selected,
	onChange,
}: DefaultSubtractionSelectorProps) {
	const {
		data: subtractions,
		isPending,
		isError,
	} = useFetchSubtractionsShortlist();

	if (isError && !subtractions) {
		return <QueryError noun="subtractions" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<SubtractionSelector
			label="Default Subtractions"
			subtractions={subtractions}
			selected={selected}
			onChange={onChange}
		/>
	);
}
