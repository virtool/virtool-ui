import { getContentScrollElement, getScrollBehavior } from "@app/scroll";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
	type ComponentPropsWithRef,
	createRef,
	type ReactNode,
	useEffect,
} from "react";

type ComposedScrollingAccordionItemProps = ComponentPropsWithRef<"div"> & {
	"data-state"?: "open" | "closed";
};

/** Composed radix accordion item for handling scroll logic  */
function ComposedScrollingAccordionItem(
	props: ComposedScrollingAccordionItemProps,
) {
	const ref = createRef<HTMLDivElement>();
	useEffect(() => {
		if (props["data-state"] === "open" && ref?.current) {
			const scroller = getContentScrollElement();
			if (!scroller) {
				return;
			}
			// Position the opened item ~50px below the top of the scrolling
			// content container. Both rects are viewport-relative, so the item's
			// offset within the scroller's content is its top minus the
			// scroller's top, plus the amount already scrolled.
			const itemTop = ref.current.getBoundingClientRect().top;
			const scrollerTop = scroller.getBoundingClientRect().top;
			scroller.scrollTo({
				top: itemTop - scrollerTop + scroller.scrollTop - 50,
				behavior: getScrollBehavior(),
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
