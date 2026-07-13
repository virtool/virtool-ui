import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import { useCreateUser } from "@users/queries";
import { useState } from "react";
import { CreateUserForm } from "./CreateUserForm";

type NewUser = {
	/** The user's handle or username */
	handle: string;
	/** The user's password */
	password: string;
	/** Whether the user will be forced to reset their password on next login */
	forceReset: boolean;
};

/**
 * A dialog for creating a new user
 */
export default function CreateUser() {
	const [open, setOpen] = useState(false);
	const mutation = useCreateUser();

	function handleSubmit({ handle, password, forceReset }: NewUser) {
		mutation.mutate(
			{ handle, password, forceReset },
			{
				onSuccess: () => {
					setOpen(false);
				},
			},
		);
	}

	function onOpenChange(open) {
		mutation.reset();
		setOpen(open);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<Button as={DialogTrigger} color="blue">
				Create
			</Button>
			<DialogContent>
				<DialogTitle>Create User</DialogTitle>
				<CreateUserForm
					onSubmit={handleSubmit}
					error={mutation.isError ? mutation.error.message : ""}
				/>
			</DialogContent>
		</Dialog>
	);
}
