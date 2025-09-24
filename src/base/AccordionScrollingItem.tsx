import { getBorder } from "@app/theme";
import * as RadixAccordion from "@radix-ui/react-accordion";
import React, { createRef, useEffect, useMemo } from "react";
import styled from "styled-components";

const StyledAccordionItem = styled(RadixAccordion.Item)`
    border: ${getBorder};
    margin-bottom: 10px;
    scroll-margin-top: 50px;
`;

/** Composed radix accordion item for handling scroll logic  */
function ComposedScrollingAccordionItem(props) {
    const ref = createRef<HTMLDivElement>();
    const dataState = useMemo(() => props["data-state"], [props]);

    useEffect(() => {
        if (dataState === "open" && ref?.current) {
            const position = ref.current.getBoundingClientRect().top;
            const offset = window.scrollY;
            window.scrollTo({
                top: position + offset - 50,
                behavior: "smooth",
            });
        }
    }, [dataState, ref]);

    return <div {...props} ref={ref} />;
}

type AccordionScrollingItemProps = {
    children: React.ReactNode;

    /** The identifying value associated with the item */
    value: string;
};

/** A radix accordion item that triggers a scroll when opened */
export default function AccordionScrollingItem({
    value,
    children,
}: AccordionScrollingItemProps) {
    return (
        <StyledAccordionItem value={value} asChild>
            <ComposedScrollingAccordionItem>
                {children}
            </ComposedScrollingAccordionItem>
        </StyledAccordionItem>
    );
}
