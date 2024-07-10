import { theme } from "@app/theme";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import styled from "styled-components";

export const ToggleGroup = styled(ToggleGroupPrimitive.Root)`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    background-color: ${theme.color.greyDark};
    border-radius: ${props => props.theme.borderRadius.sm};
`;
