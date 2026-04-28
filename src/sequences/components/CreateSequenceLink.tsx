import { cn } from "@app/utils";
import { useOtuDetailSearch } from "@otus/components/Detail/OtuDetailSearchContext";
import { useCheckReferenceRight } from "@references/hooks";

type CreateSequenceLinkProps = {
	refId: string;
};

/**
 * Displays a link to add a sequence
 */
export default function CreateSequenceLink({ refId }: CreateSequenceLinkProps) {
	const { hasPermission: canModify } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);
	const { setSearch } = useOtuDetailSearch();

	if (canModify) {
		return (
			<button
				className={cn(
					"ml-auto",
					"cursor-pointer",
					"bg-transparent",
					"border-0",
					"p-0",
				)}
				onClick={() => setSearch({ openCreateSequence: true })}
				type="button"
			>
				Create Sequence
			</button>
		);
	}

	return null;
}
