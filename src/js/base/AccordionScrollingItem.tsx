import { getBorder } from "@app/theme";
import * as RadixAccordion from "@radix-ui/react-accordion";
import React, { createRef, useEffect } from "react";
import styled from "styled-components";

export const StyledAccordionItem = styled(RadixAccordion.Item)`
    border: ${getBorder};
    margin-bottom: 10px;
    scroll-margin-top: 50px;
`;

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
    }, [props["data-state"]]);

    return <div {...props} ref={ref} />;
}

type AccordionItemProps = {
    children: React.ReactNode;
    /** The identifying value associated with the item */
    value: string;
};

/** A radix accordion item that triggers a scroll when opened */
export function AccordionScrollingItem({
    value,
    children,
}: AccordionItemProps) {
    return (
        <StyledAccordionItem value={value} asChild>
            <ComposedScrollingAccordionItem>
                {children}
            </ComposedScrollingAccordionItem>
        </StyledAccordionItem>
    );
}
