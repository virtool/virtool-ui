import { getFontWeight } from "../app/theme";
import { ReactNode } from "react";
import styled from "styled-components";

type InputErrorProps = {
    children: ReactNode;
};

const InputError = styled.p<InputErrorProps>`
    color: ${(props) => props.theme.color.red};
    font-size: ${(props) => props.theme.fontSize.sm};
    font-weight: ${getFontWeight("thick")};
    margin: 5px 0 -10px;
    min-height: 18px;
    text-align: right;
`;

InputError.displayName = "InputError";

export default InputError;
