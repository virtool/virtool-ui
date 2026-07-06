import Button from "@base/Button";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";

type CreateSequenceButtonProps = {
	onCreate: () => void;
	refId: string;
};

/**
 * Displays a button to add a sequence
 */
export default function CreateSequenceButton({
	onCreate,
	refId,
}: CreateSequenceButtonProps) {
	const { hasPermission: canModify } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);
	const archived = useReferenceIsArchived(refId);

	if (canModify && !archived) {
		return (
			<Button color="blue" size="small" onClick={onCreate}>
				Create Sequence
			</Button>
		);
	}

	return null;
}
