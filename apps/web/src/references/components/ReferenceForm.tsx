import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import TextArea from "@base/TextArea";
import { useId } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type ReferenceFormMode = "edit" | "empty";

type FormValues = {
	name: string;
	description: string;
	organism: string;
};

type ReferenceFormProps = {
	/** Form validation errors */
	errors: FieldErrors<FormValues>;
	/** The mode of the reference form */
	mode: ReferenceFormMode;
	/** Function to register form fields */
	register: UseFormRegister<FormValues>;
};

/**
 * Form input fields for organism, name and description
 */
export function ReferenceForm({ errors, mode, register }: ReferenceFormProps) {
	const nameId = useId();
	const organismId = useId();
	const descriptionId = useId();

	const organismComponent =
		mode === "empty" || mode === "edit" ? (
			<InputGroup>
				<InputLabel htmlFor={organismId}>Organism</InputLabel>
				<InputSimple id={organismId} {...register("organism")} />
			</InputGroup>
		) : null;

	return (
		<>
			<InputGroup className="pb-0">
				<InputLabel htmlFor={nameId}>Name</InputLabel>
				<InputSimple
					id={nameId}
					{...register("name", { required: "Required Field" })}
				/>
				<InputError>{errors.name?.message}</InputError>
			</InputGroup>

			{organismComponent}

			<InputGroup>
				<InputLabel htmlFor={descriptionId}>Description</InputLabel>
				<TextArea id={descriptionId} {...register("description")} />
			</InputGroup>
		</>
	);
}
