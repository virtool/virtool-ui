import { cn } from "@app/utils";
import Icon from "@base/Icon";
import type { LucideIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

type SelectButtonProps = {
	placeholder?: string;
	className?: string;
	icon: LucideIcon;
	id?: string;
};

export default function SelectButton({
	placeholder,
	icon: LucideIcon,
	className,
	id,
}: SelectButtonProps) {
	return (
		<SelectPrimitive.Trigger
			className={cn(
				"flex justify-between items-center px-2.5 py-1.5 bg-white border border-gray-300 rounded font-medium capitalize [&_svg]:ml-1",
				className,
			)}
			id={id}
		>
			<SelectPrimitive.Value placeholder={placeholder} />
			<Icon icon={LucideIcon} />
		</SelectPrimitive.Trigger>
	);
}
