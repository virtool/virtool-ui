import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@base/Dialog";
import SaveButton from "@base/SaveButton";
import { useUpdateReference } from "@references/queries";
import type { Reference } from "@references/types";
import { useForm } from "react-hook-form";
import { ReferenceForm } from "../ReferenceForm";

export type FormValues = {
	name: string;
	description: string;
	organism: string;
};

type EditReferenceProps = {
	/** The reference details */
	detail: Reference;
	open?: boolean;
	setOpen?: (open: boolean) => void;
};

/**
 * A dialog for editing a reference
 */
export default function EditReference({
	detail,
	open = false,
	setOpen = () => {},
}: EditReferenceProps) {
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<FormValues>({
		defaultValues: {
			name: detail.name,
			description: detail.description,
			organism: detail.organism,
		},
	});
	const { mutation } = useUpdateReference(detail.id);

	function handleEdit({ name, description, organism }) {
		mutation.mutate({ name, description, organism });
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={() => setOpen(false)}>
			<DialogContent>
				<DialogTitle>Edit Reference</DialogTitle>
				<form onSubmit={handleSubmit((values) => handleEdit({ ...values }))}>
					<ReferenceForm errors={errors} mode="edit" register={register} />
					<DialogFooter>
						<SaveButton />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
