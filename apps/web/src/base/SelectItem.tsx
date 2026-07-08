import { cn } from "@app/utils";
import { Check } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { selectItemStateClasses } from "./styles";

/**
 * The check mark shown on the currently-selected Select item. Positioned in the
 * left gutter that every Select item reserves with `pl-6`.
 */
export function SelectItemIndicator() {
	return (
		<SelectPrimitive.ItemIndicator className="absolute left-1.5 top-1/2 -translate-y-1/2 inline-flex items-center text-blue-500">
			<Check size={14} />
		</SelectPrimitive.ItemIndicator>
	);
}

export default function SelectItem({ value, children, description }) {
	return (
		<SelectPrimitive.Item
			className={cn(
				"text-sm font-medium flex flex-col items-start py-1.5 pr-9 pl-6 mb-1 capitalize",
				selectItemStateClasses,
			)}
			data-slot="select-item"
			value={value}
			key={value}
		>
			<SelectItemIndicator />
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			{description && (
				<div className="text-xs font-normal text-gray-600 mt-1 whitespace-pre-wrap">
					{description}
				</div>
			)}
		</SelectPrimitive.Item>
	);
}
