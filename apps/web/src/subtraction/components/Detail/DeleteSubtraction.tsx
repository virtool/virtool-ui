import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import IconButton from "@base/IconButton";
import { useRemoveSubtraction } from "@subtraction/queries";
import type { Subtraction } from "@subtraction/types";
import { useNavigate } from "@tanstack/react-router";
import { Trash } from "lucide-react";

export type DeleteSubtractionProps = {
	/** The subtraction data */
	subtraction: Subtraction;
};

/**
 * Dialog for deleting an existing subtraction
 */
export default function DeleteSubtraction({
	subtraction,
}: DeleteSubtractionProps) {
	const mutation = useRemoveSubtraction();
	const navigate = useNavigate();

	function handleConfirm() {
		mutation.mutate(
			{ subtractionId: subtraction.id },
			{
				onSuccess: () => {
					navigate({ to: "/subtractions" });
				},
			},
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<IconButton IconComponent={Trash} color="red" tip="delete" />
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Delete Subtraction</DialogTitle>
				<span>
					Are you sure you want to delete <strong>{subtraction.name}</strong>?
				</span>

				<DialogFooter>
					<Button color="red" onClick={handleConfirm}>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
