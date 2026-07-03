import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import IconButton from "@base/IconButton";
import { Trash } from "lucide-react";
import { useState } from "react";

type DeleteLabelProps = {
	name: string;
	/** Resolves on success so the dialog can close. */
	onConfirm: () => Promise<unknown>;
};

/**
 * Dialog confirming label removal. Pure presentation — deletion is delegated
 * to `onConfirm`.
 */
export function DeleteLabel({ name, onConfirm }: DeleteLabelProps) {
	const [open, setOpen] = useState(false);

	async function handleConfirm() {
		try {
			await onConfirm();
			setOpen(false);
		} catch {
			// Leave the dialog open if deletion fails; surfacing the error is
			// the caller's responsibility for now.
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<IconButton IconComponent={Trash} color="red" tip="delete label" />
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Delete Label</DialogTitle>
				<p className="text-base">
					Are you sure you want to delete the label <strong>{name}</strong>?
				</p>
				<footer className="mt-8 flex">
					<Button type="button" color="red" onClick={handleConfirm}>
						Delete
					</Button>
				</footer>
			</DialogContent>
		</Dialog>
	);
}
