import { Accordion as AccordionPrimitive } from "radix-ui";
import styled from "styled-components";

/** display the content of the accordion dropdown based on state */
const AccordionContent = styled(AccordionPrimitive.Content)`
    overflow: hidden;
    padding: 0 15px;

    &[data-state="closed"] {
        display: none;
    }
`;

export default AccordionContent;
