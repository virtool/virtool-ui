import Button from "@base/Button";
import { DialogFooter } from "@base/Dialog";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useCreateReference } from "../queries";
import { ReferenceForm } from "./ReferenceForm";

type FormValues = {
	name: string;
	description: string;
	organism: string;
};

/**
 * A form for creating an empty reference
 */
export default function EmptyReference() {
	const navigate = useNavigate();

	const mutation = useCreateReference();

	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			description: "",
			organism: "",
		},
	});

	return (
		<form
			onSubmit={handleSubmit((values) =>
				mutation.mutate(values, {
					onSuccess: () => {
						navigate({ to: "/refs" });
					},
				}),
			)}
		>
			<ReferenceForm errors={errors} mode="empty" register={register} />
			<DialogFooter>
				<Button type="submit" color="blue">
					Save
				</Button>
			</DialogFooter>
		</form>
	);
}
