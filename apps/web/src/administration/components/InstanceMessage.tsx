import { cn } from "@app/utils";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { useSetMessage } from "@message/queries";
import type { Message, MessageColor } from "@message/types";
import { Controller, useForm } from "react-hook-form";

const colorOptions: { value: MessageColor; swatch: string; label: string }[] = [
	{ value: "red", swatch: "bg-red-500", label: "Red" },
	{ value: "orange", swatch: "bg-orange-500", label: "Orange" },
	{ value: "yellow", swatch: "bg-yellow-500", label: "Yellow" },
	{ value: "blue", swatch: "bg-blue-500", label: "Blue" },
	{ value: "purple", swatch: "bg-purple-500", label: "Purple" },
	{ value: "grey", swatch: "bg-gray-500", label: "Grey" },
];

type ColorPickerProps = {
	id: string;
	value: MessageColor;
	onChange: (value: MessageColor) => void;
};

function ColorPicker({ id, value, onChange }: ColorPickerProps) {
	return (
		<fieldset id={id} className="flex gap-2 mt-1 border-0 p-0">
			{colorOptions.map((option) => (
				<label
					key={option.value}
					className={cn(
						option.swatch,
						"h-8",
						"w-8",
						"rounded-full",
						"cursor-pointer",
						"ring-offset-2",
						"focus-within:ring-2",
						"focus-within:ring-blue-500",
						value === option.value && "ring-2 ring-gray-900",
					)}
				>
					<input
						type="radio"
						name="instance-message-color"
						value={option.value}
						checked={value === option.value}
						onChange={() => onChange(option.value)}
						aria-label={option.label}
						className="sr-only"
					/>
				</label>
			))}
		</fieldset>
	);
}

type InstanceMessageProps = {
	message: Message | null;
};

/**
 * Displays the instance message and provides functionality to update it
 */
export default function InstanceMessage({ message }: InstanceMessageProps) {
	const { control, register, handleSubmit } = useForm<{
		message: string;
		color: MessageColor;
	}>({
		defaultValues: {
			message: message?.message || "",
			color: message?.color ?? "red",
		},
	});
	const mutation = useSetMessage();

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2>Instance Message</h2>
				<p>Display a message to all users above the navigation bar.</p>
			</BoxGroupHeader>
			<BoxGroupSection>
				<form
					onSubmit={handleSubmit(({ message, color }) =>
						mutation.mutate({ message, color }),
					)}
				>
					<InputGroup>
						<InputLabel htmlFor="message">Message</InputLabel>
						<InputSimple id="message" {...register("message")} />
					</InputGroup>
					<InputGroup>
						<InputLabel htmlFor="color">Color</InputLabel>
						<Controller
							control={control}
							name="color"
							render={({ field }) => (
								<ColorPicker
									id="color"
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
					</InputGroup>
					<SaveButton />
				</form>
			</BoxGroupSection>
		</BoxGroup>
	);
}
