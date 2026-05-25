import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import IconButton from "@base/IconButton";
import type { MessageColor } from "@message/types";
import { Pen } from "lucide-react";
import { useState } from "react";
import InstanceMessageForm, {
	type InstanceMessageFormValues,
} from "./InstanceMessageForm";

type EditInstanceMessageProps = {
	color: MessageColor;
	message: string;
	/** Resolves on success so the dialog can close; rejects to surface the error. */
	onSubmit: (values: InstanceMessageFormValues) => Promise<unknown>;
};

/**
 * Dialog for editing an existing instance message. Pure presentation —
 * submission is delegated to `onSubmit`.
 */
export default function EditInstanceMessage({
	color,
	message,
	onSubmit,
}: EditInstanceMessageProps) {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | undefined>();

	async function handleSubmit(values: InstanceMessageFormValues) {
		setError(undefined);
		try {
			await onSubmit(values);
			setOpen(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Could not update message.",
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
			<IconButton
				IconComponent={Pen}
				onClick={() => setOpen(true)}
				tip="Edit"
			/>
			<DialogContent>
				<DialogTitle>Edit Instance Message</DialogTitle>
				<InstanceMessageForm
					color={color}
					error={error}
					message={message}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
}
