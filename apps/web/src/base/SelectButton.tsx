import { cn } from "@app/cn";
import Icon from "@base/Icon";
import type { LucideIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import type { AriaAttributes } from "react";
import { inputFocusClasses, inputHeightClass } from "./styles";

type SelectButtonProps = {
	placeholder?: string;
	className?: string;
	icon: LucideIcon;
	id?: string;
	"aria-label"?: string;
	/** Marks the trigger invalid, turning its border and focus ring red */
	"aria-invalid"?: AriaAttributes["aria-invalid"];
};

export default function SelectButton({
	placeholder,
	icon: LucideIcon,
	className,
	id,
	"aria-label": ariaLabel,
	"aria-invalid": ariaInvalid,
}: SelectButtonProps) {
	return (
		<SelectPrimitive.Trigger
			aria-invalid={ariaInvalid}
			aria-label={ariaLabel}
			className={cn(
				"flex justify-between items-center px-2.5 bg-white border rounded font-medium capitalize [&_svg]:ml-1",
				inputHeightClass,
				inputFocusClasses,
				"data-[placeholder]:text-gray-400",
				"aria-invalid:border-red-500 aria-invalid:focus-visible:border-red-500 aria-invalid:focus-visible:ring-2 aria-invalid:focus-visible:ring-red-500/50",
				className,
			)}
			data-slot="select-trigger"
			id={id}
		>
			<SelectPrimitive.Value placeholder={placeholder} />
			<Icon icon={LucideIcon} />
		</SelectPrimitive.Trigger>
	);
}
