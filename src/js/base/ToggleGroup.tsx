import { theme } from "@app/theme";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import styled from "styled-components";

export const ToggleGroup = styled(ToggleGroupPrimitive.Root)`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 0 1px;
    background-color: ${theme.color.greyLight};
    border-radius: ${props => props.theme.borderRadius.sm};
`;
