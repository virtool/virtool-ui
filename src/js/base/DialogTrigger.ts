import * as DialogPrimitive from "@radix-ui/react-dialog";
import styled from "styled-components";
import { getBorder } from "../app/theme";

export const DialogTrigger = styled(DialogPrimitive.Trigger)`
    all: unset;
    background: ${props => props.theme.color.white};
    border: ${getBorder};
    display: flex;
    cursor: pointer;
    padding: 2px 7px;
`;
