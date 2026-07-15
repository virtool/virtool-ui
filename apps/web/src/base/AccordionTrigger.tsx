import { cn } from "@app/cn";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

/** button for toggling the display of accordion contents  */
export default function AccordionTrigger({
	className,
	...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Trigger
			className={cn(
				"flex items-center justify-between w-full bg-white border-none px-4 py-2.5 hover:bg-gray-50",
				className,
			)}
			{...props}
		/>
	);
}
