import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import { useState } from "react";
import { LabelForm } from "./LabelForm";

/** Fields collected by the create-label form. */
export type NewLabel = {
	color: string;
	description: string;
	name: string;
};

type CreateLabelProps = {
	/** Resolves on success so the dialog can close; rejects to surface the error. */
	onSubmit: (values: NewLabel) => Promise<unknown>;
};

/**
 * Dialog for creating a label. Pure presentation — submission is delegated
 * to `onSubmit`; rejection messages are displayed inline.
 */
export function CreateLabel({ onSubmit }: CreateLabelProps) {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | undefined>();

	async function handleSubmit(values: NewLabel) {
		setError(undefined);
		try {
			await onSubmit(values);
			setOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create label.");
		}
	}

	function handleOpenChange(next: boolean) {
		setOpen(next);
		if (!next) {
			setError(undefined);
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Button as={DialogTrigger} color="blue">
				Create
			</Button>
			<DialogContent>
				<DialogTitle>Create a Label</DialogTitle>
				<LabelForm error={error} onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
