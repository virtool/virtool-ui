import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import { useState } from "react";
import { useRemoveLabel } from "../queries";

type RemoveLabelProps = {
	id: number;
	name: string;
};

/**
 * Displays a dialog for removing a label
 */
export function RemoveLabel({ id, name }: RemoveLabelProps) {
	const [open, setOpen] = useState(false);
	const mutation = useRemoveLabel();

	function handleSubmit() {
		mutation.mutate(
			{ labelId: id },
			{
				onSuccess: () => {
					setOpen(false);
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<Button as={DialogTrigger} color="red" size="small">
				Delete
			</Button>
			<DialogContent>
				<DialogTitle>Delete Label</DialogTitle>
				<p className="text-base">
					Are you sure you want to delete the label <strong>{name}</strong>?
				</p>
				<footer className="mt-8 flex">
					<Button type="button" color="red" onClick={handleSubmit}>
						Delete
					</Button>
				</footer>
			</DialogContent>
		</Dialog>
	);
}
