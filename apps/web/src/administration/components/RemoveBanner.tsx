import Button from "@base/Button";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import IconButton from "@base/IconButton";
import { Trash } from "lucide-react";
import { useState } from "react";

type RemoveBannerProps = {
	message: string;
	/** Resolves on success so the dialog can close. */
	onConfirm: () => Promise<unknown>;
};

/**
 * Dialog confirming banner removal. Pure presentation — deletion is delegated
 * to `onConfirm`.
 */
export default function RemoveBanner({
	message,
	onConfirm,
}: RemoveBannerProps) {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function handleOpenChange(next: boolean) {
		setOpen(next);
		if (!next) {
			setError(null);
		}
	}

	async function handleConfirm() {
		try {
			setError(null);
			await onConfirm();
			setOpen(false);
		} catch {
			setError("Failed to delete the banner. Please try again.");
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<IconButton
				color="red"
				IconComponent={Trash}
				onClick={() => setOpen(true)}
				tip="Delete"
			/>
			<DialogContent>
				<DialogTitle>Delete Banner</DialogTitle>
				<p className="text-base">
					Are you sure you want to delete the banner <strong>{message}</strong>?
				</p>
				{error && (
					<p role="alert" className="mt-4 text-red-600">
						{error}
					</p>
				)}
				<footer className="mt-8 flex">
					<Button type="button" color="red" onClick={handleConfirm}>
						Delete
					</Button>
				</footer>
			</DialogContent>
		</Dialog>
	);
}
