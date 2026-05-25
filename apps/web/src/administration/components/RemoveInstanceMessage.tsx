import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import { useState } from "react";

type RemoveInstanceMessageProps = {
	message: string;
	/** Resolves on success so the dialog can close. */
	onConfirm: () => Promise<unknown>;
};

/**
 * Dialog confirming instance-message removal. Pure presentation — deletion is
 * delegated to `onConfirm`.
 */
export default function RemoveInstanceMessage({
	message,
	onConfirm,
}: RemoveInstanceMessageProps) {
	const [open, setOpen] = useState(false);

	async function handleConfirm() {
		try {
			await onConfirm();
			setOpen(false);
		} catch {
			// Leave the dialog open if deletion fails.
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button as={DialogTrigger} color="red" size="small">
				Delete
			</Button>
			<DialogContent>
				<DialogTitle>Delete Instance Message</DialogTitle>
				<p className="text-base">
					Are you sure you want to delete the message <strong>{message}</strong>
					?
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
