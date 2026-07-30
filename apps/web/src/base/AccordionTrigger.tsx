import { cn } from "@app/cn";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";

/**
 * Button for toggling the display of accordion contents.
 *
 * Wrapped in the primitive's header, which renders an `h3` — the ARIA accordion
 * pattern puts every trigger in a heading so the list can be navigated by
 * heading rather than only by tabbing through it.
 */
export default function AccordionTrigger({
	className,
	...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className="m-0">
			<AccordionPrimitive.Trigger
				className={cn(
					"flex items-center justify-between w-full bg-white border-none px-4 py-2.5 hover:bg-gray-50",
					className,
				)}
				{...props}
			/>
		</AccordionPrimitive.Header>
	);
}
