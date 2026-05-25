import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import { useState } from "react";
import InstanceMessageForm, {
	type InstanceMessageFormValues,
} from "./InstanceMessageForm";

type CreateInstanceMessageProps = {
	/** Resolves on success so the dialog can close; rejects to surface the error. */
	onSubmit: (values: InstanceMessageFormValues) => Promise<unknown>;
};

/**
 * Dialog for creating a new instance message. Pure presentation — submission
 * is delegated to `onSubmit`; rejection messages are displayed inline.
 */
export default function CreateInstanceMessage({
	onSubmit,
}: CreateInstanceMessageProps) {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | undefined>();

	async function handleSubmit(values: InstanceMessageFormValues) {
		setError(undefined);
		try {
			await onSubmit(values);
			setOpen(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Could not create message.",
			);
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
				<DialogTitle>Create an Instance Message</DialogTitle>
				<InstanceMessageForm error={error} onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
