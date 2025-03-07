import * as RadixAccordion from "@radix-ui/react-accordion";
import styled from "styled-components";

/** display the content of the accordion dropdown based on state */
const AccordionContent = styled(RadixAccordion.Content)`
    overflow: hidden;
    padding: 0 15px;

    &[data-state="closed"] {
        display: none;
    }
`;

export default AccordionContent;
