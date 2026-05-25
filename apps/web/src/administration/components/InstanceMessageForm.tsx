import Button from "@base/Button";
import { DialogFooter } from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import type { MessageColor } from "@message/types";
import { Controller, useForm } from "react-hook-form";
import InstanceMessageColorPicker from "./InstanceMessageColorPicker";

/** Values produced by the instance-message form. */
export type InstanceMessageFormValues = {
	color: MessageColor;
	message: string;
};

type InstanceMessageFormProps = {
	color?: MessageColor;
	error?: string;
	message?: string;
	onSubmit: (values: InstanceMessageFormValues) => void;
	submitLabel?: string;
};

/**
 * Form for creating or editing an instance message. Shared between the create
 * and edit dialogs.
 */
export default function InstanceMessageForm({
	color = "red",
	error = "",
	message = "",
	onSubmit,
	submitLabel = "Save",
}: InstanceMessageFormProps) {
	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<InstanceMessageFormValues>({
		defaultValues: { color, message },
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<InputGroup>
				<InputLabel htmlFor="message">Message</InputLabel>
				<InputSimple
					id="message"
					aria-invalid={errors.message ? "true" : "false"}
					{...register("message", { required: "Message is required." })}
				/>
				<InputError>{errors.message?.message || error}</InputError>
			</InputGroup>
			<InputGroup>
				<InputLabel htmlFor="color">Color</InputLabel>
				<Controller
					control={control}
					name="color"
					render={({ field }) => (
						<InstanceMessageColorPicker
							id="color"
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
			</InputGroup>
			<DialogFooter>
				<Button color="blue" type="submit">
					{submitLabel}
				</Button>
			</DialogFooter>
		</form>
	);
}
