import Button from "@base/Button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@base/Dialog";
import {
	useArchiveReference,
	useUnarchiveReference,
} from "@references/queries";
import type { Reference } from "@references/types";

type ArchiveReferenceProps = {
	detail: Reference;
	open?: boolean;
	setOpen?: (open: boolean) => void;
};

/**
 * A dialog confirming that the user wants to archive or unarchive a reference
 */
export default function ArchiveReference({
	detail,
	open = false,
	setOpen = () => {},
}: ArchiveReferenceProps) {
	const archiveMutation = useArchiveReference(detail.id);
	const unarchiveMutation = useUnarchiveReference(detail.id);

	const mutation = detail.archived ? unarchiveMutation : archiveMutation;
	const verb = detail.archived ? "Unarchive" : "Archive";

	function handleConfirm() {
		mutation.mutate(undefined, {
			onSuccess: () => setOpen(false),
		});
	}

	function handleOpenChange(next: boolean) {
		if (!next) {
			mutation.reset();
			setOpen(false);
		}
	}

	const isOfficialConflict = mutation.error?.response?.status === 409;
	const errorMessage = mutation.error
		? isOfficialConflict
			? "The official reference cannot be archived."
			: `Failed to ${verb.toLowerCase()} reference. Please try again.`
		: null;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogTitle>{verb} reference</DialogTitle>
				<p>
					{detail.archived ? (
						<span>
							Restore <strong>{detail.name}</strong> to the active references
							list?
						</span>
					) : (
						<span>
							Archive <strong>{detail.name}</strong>? Archived references are
							hidden from the default list but are not deleted.
						</span>
					)}
				</p>
				{errorMessage && <p className="pt-3 text-red-600">{errorMessage}</p>}
				<DialogFooter>
					<Button onClick={handleConfirm}>{verb}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
