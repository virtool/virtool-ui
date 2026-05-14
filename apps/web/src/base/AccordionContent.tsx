import { cn } from "@app/utils";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

/** display the content of the accordion dropdown based on state */
const AccordionContent = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, ...props }, ref) {
	return (
		<AccordionPrimitive.Content
			ref={ref}
			className={cn(
				"overflow-hidden px-4 data-[state=closed]:hidden",
				className,
			)}
			{...props}
		/>
	);
});

export default AccordionContent;
