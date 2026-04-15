import { cn } from "@app/utils";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

/** button for toggling the display of accordion contents  */
const AccordionTrigger = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, ...props }, ref) {
	return (
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				"flex items-center justify-between w-full bg-white border-none px-4 py-2.5 hover:bg-gray-50",
				className,
			)}
			{...props}
		/>
	);
});

export default AccordionTrigger;
