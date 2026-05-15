import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { useCreateOTU } from "../queries";
import OtuForm from "./OtuForm";

type CreateOTUProps = {
	open: boolean;
	refId: string;
	setOpen: (open: boolean) => void;
};

/**
 * Displays a dialog to create an OTU
 */
export default function OtuCreate({ open, refId, setOpen }: CreateOTUProps) {
	const mutation = useCreateOTU(refId);

	function handleSubmit({ name, abbreviation }) {
		mutation.mutate(
			{ name, abbreviation },
			{
				onSuccess: () => {
					setOpen(false);
				},
			},
		);
	}

	function onHide() {
		setOpen(false);
		mutation.reset();
	}

	return (
		<Dialog open={open} onOpenChange={onHide}>
			<DialogContent>
				<DialogTitle>Create OTU</DialogTitle>
				<OtuForm
					onSubmit={handleSubmit}
					error={mutation.isError && mutation.error.response?.body?.message}
				/>
			</DialogContent>
		</Dialog>
	);
}
