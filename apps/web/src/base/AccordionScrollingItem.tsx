import { Accordion as AccordionPrimitive } from "radix-ui";
import { createRef, type ReactNode, useEffect } from "react";

/** Composed radix accordion item for handling scroll logic  */
function ComposedScrollingAccordionItem(props) {
	const ref = createRef<HTMLDivElement>();
	useEffect(() => {
		if (props["data-state"] === "open" && ref?.current) {
			const position = ref.current.getBoundingClientRect().top;
			const offset = window.scrollY;
			window.scrollTo({
				top: position + offset - 50,
				behavior: "smooth",
			});
		}
	}, [props["data-state"], ref?.current]);

	return (
		<div
			{...props}
			ref={ref}
			className="border border-gray-300 mb-2.5 scroll-mt-12"
		/>
	);
}

type AccordionScrollingItemProps = {
	children: ReactNode;

	/** The identifying value associated with the item */
	value: string;
};

/** A radix accordion item that triggers a scroll when opened */
export default function AccordionScrollingItem({
	value,
	children,
}: AccordionScrollingItemProps) {
	return (
		<AccordionPrimitive.Item value={value} asChild>
			<ComposedScrollingAccordionItem>
				{children}
			</ComposedScrollingAccordionItem>
		</AccordionPrimitive.Item>
	);
}
