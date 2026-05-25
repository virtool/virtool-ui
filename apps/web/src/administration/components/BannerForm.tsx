import type { BannerColor } from "@banner/types";
import Button from "@base/Button";
import { DialogFooter } from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import { Controller, useForm } from "react-hook-form";
import BannerColorPicker from "./BannerColorPicker";

/** Values produced by the banner form. */
export type BannerFormValues = {
	color: BannerColor;
	message: string;
};

type BannerFormProps = {
	color?: BannerColor;
	error?: string;
	message?: string;
	onSubmit: (values: BannerFormValues) => void;
	submitLabel?: string;
};

/**
 * Form for creating or editing a banner. Shared between the create and edit
 * dialogs.
 */
export default function BannerForm({
	color = "red",
	error = "",
	message = "",
	onSubmit,
	submitLabel = "Save",
}: BannerFormProps) {
	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<BannerFormValues>({
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
						<BannerColorPicker
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
