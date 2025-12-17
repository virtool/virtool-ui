import { getColor } from "@app/theme";
import { Accordion as AccordionPrimitive } from "radix-ui";
import styled from "styled-components";

/** button for toggling the display of accordion contents  */
const AccordionTrigger = styled(AccordionPrimitive.Trigger)`
    align-items: center;
    background-color: ${(props) => props.theme.color.white};
    border: none;
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    width: 100%;

    &:hover {
        background-color: ${(props) =>
            getColor({ color: "greyHover", theme: props.theme })};
    }
`;

export default AccordionTrigger;
