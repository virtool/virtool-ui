import { getBorder } from "@app/theme";
import styled from "styled-components";

type BoxProps = {
    active?: boolean;
    onClick?: () => void;
};

export const Box = styled.div<BoxProps>`
    border: ${getBorder};
    border-radius: ${(props) => props.theme.borderRadius.sm};
    box-sizing: border-box;
    cursor: ${(props) => (props.onClick ? "pointer" : "auto")};
    margin-bottom: 15px;
    padding: 10px 15px;
    position: relative;

    &:hover {
        ${(props) =>
            props.onClick
                ? `background-color: ${props.theme.color.greyHover};`
                : ""}
    }
`;

Box.displayName = "Box";

export default Box;
