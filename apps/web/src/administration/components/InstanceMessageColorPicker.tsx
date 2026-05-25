import { cn } from "@app/utils";
import { type MessageColor, messageColors } from "@message/types";

const swatchClasses: Record<MessageColor, string> = {
	red: "bg-red-500",
	orange: "bg-orange-500",
	yellow: "bg-yellow-500",
	blue: "bg-blue-500",
	purple: "bg-purple-500",
	grey: "bg-gray-500",
};

const labels: Record<MessageColor, string> = {
	red: "Red",
	orange: "Orange",
	yellow: "Yellow",
	blue: "Blue",
	purple: "Purple",
	grey: "Grey",
};

type InstanceMessageColorPickerProps = {
	id?: string;
	name?: string;
	value: MessageColor;
	onChange: (value: MessageColor) => void;
};

/**
 * Radio group for picking an instance-message banner color. Renders the
 * `messageColors` palette as colored circles.
 */
export default function InstanceMessageColorPicker({
	id,
	name = "instance-message-color",
	value,
	onChange,
}: InstanceMessageColorPickerProps) {
	return (
		<fieldset id={id} className="flex gap-2 mt-1 border-0 p-0">
			{messageColors.map((color) => (
				<label
					key={color}
					className={cn(
						swatchClasses[color],
						"h-8",
						"w-8",
						"rounded-full",
						"cursor-pointer",
						"ring-offset-2",
						"focus-within:ring-2",
						"focus-within:ring-blue-500",
						value === color && "ring-2 ring-gray-900",
					)}
				>
					<input
						type="radio"
						name={name}
						value={color}
						checked={value === color}
						onChange={() => onChange(color)}
						aria-label={labels[color]}
						className="sr-only"
					/>
				</label>
			))}
		</fieldset>
	);
}
