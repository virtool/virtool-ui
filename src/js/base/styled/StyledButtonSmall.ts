import styled from "styled-components";
import { getFontSize } from "../../app/theme";
import { StyledButton } from "./StyledButton";

export const StyledButtonSmall = styled(StyledButton)`
    border-radius: ${props => props.theme.borderRadius.sm};
    font-size: ${getFontSize("md")};
    min-width: 32px;
    min-height: 24px;
    padding: 0 10px;

    i {
        font-size: 12px;
    }
`;

StyledButton.displayName = "StyledButtonSmall";
