import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import { useState } from "react";
import BannerForm, { type BannerFormValues } from "./BannerForm";

type CreateBannerProps = {
	/** Resolves on success so the dialog can close; rejects to surface the error. */
	onSubmit: (values: BannerFormValues) => Promise<unknown>;
};

/**
 * Dialog for creating a new banner. Pure presentation — submission is
 * delegated to `onSubmit`; rejection messages are displayed inline.
 */
export default function CreateBanner({ onSubmit }: CreateBannerProps) {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | undefined>();

	async function handleSubmit(values: BannerFormValues) {
		setError(undefined);
		try {
			await onSubmit(values);
			setOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create banner.");
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
				<DialogTitle>Create a Banner</DialogTitle>
				<BannerForm error={error} onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
