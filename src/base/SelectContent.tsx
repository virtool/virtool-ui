import { ChevronDown, ChevronUp } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import Icon from "./Icon";

export default function SelectContent({ children, position, align }) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				className="origin-top animate-contentOpen bg-white rounded-md shadow-md overflow-hidden z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] first:mt-2.5"
				position={position}
				align={align}
				side="bottom"
				avoidCollisions={false}
			>
				<SelectPrimitive.ScrollUpButton className="my-1 flex justify-center hover:bg-gray-50">
					<Icon icon={ChevronUp} />
				</SelectPrimitive.ScrollUpButton>
				<SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
				<SelectPrimitive.ScrollDownButton className="my-1 flex justify-center hover:bg-gray-50">
					<Icon icon={ChevronDown} />
				</SelectPrimitive.ScrollDownButton>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}
