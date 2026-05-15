import { Select as SelectPrimitive } from "radix-ui";

export default function SelectItem({ value, children, description }) {
	return (
		<SelectPrimitive.Item
			className="text-sm font-medium flex flex-col items-start py-1.5 pr-9 pl-6 relative select-none mb-1 capitalize hover:bg-gray-50 hover:border-0"
			value={value}
			key={value}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			{description && (
				<div className="text-xs font-normal text-gray-600 mt-1 whitespace-pre-wrap">
					{description}
				</div>
			)}
		</SelectPrimitive.Item>
	);
}
