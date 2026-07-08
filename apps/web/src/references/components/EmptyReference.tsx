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

type EmptyReferenceProps = {
	onSuccess?: () => void;
};

/**
 * A form for creating an empty reference
 */
export default function EmptyReference({ onSuccess }: EmptyReferenceProps) {
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
						onSuccess?.();
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
