import Button from "@base/Button";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";

type CreateSequenceButtonProps = {
	onCreate: () => void;
	referenceId: number;
};

/**
 * Displays a button to add a sequence
 */
export default function CreateSequenceButton({
	onCreate,
	referenceId,
}: CreateSequenceButtonProps) {
	const { hasPermission: canModify } = useCheckReferenceRight(
		referenceId,
		"modifyOtu",
	);
	const archived = useReferenceIsArchived(referenceId);

	if (canModify && !archived) {
		return (
			<Button color="blue" size="small" onClick={onCreate}>
				Create Sequence
			</Button>
		);
	}

	return null;
}
