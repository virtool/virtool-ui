import * as DialogPrimitive from "@radix-ui/react-dialog";
import styled from "styled-components";
import { getFontWeight } from "../app/theme";

export const DialogTitle = styled(DialogPrimitive.Title)`
    font-weight: ${getFontWeight("thick")};
    margin: 10px 0 20px;
`;
