import * as RadixAccordion from "@radix-ui/react-accordion";
import styled from "styled-components";
import { getColor } from "../../app/theme";

/** button for toggling the display of accordion contents  */
export const AccordionTrigger = styled(RadixAccordion.Trigger)`
    width: 100%;
    background-color: ${(props) => props.theme.color.white};
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;

    &:hover {
        background-color: ${(props) =>
            getColor({ color: "greyHover", theme: props.theme })};
    }
`;
