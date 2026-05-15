import { cn } from "@app/utils";
import { useCheckReferenceRight } from "@references/hooks";

type CreateSequenceLinkProps = {
	onCreate: () => void;
	refId: string;
};

/**
 * Displays a link to add a sequence
 */
export default function CreateSequenceLink({
	onCreate,
	refId,
}: CreateSequenceLinkProps) {
	const { hasPermission: canModify } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);

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
				onClick={onCreate}
				type="button"
			>
				Create Sequence
			</button>
		);
	}

	return null;
}
