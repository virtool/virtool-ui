import styled from "styled-components";
import { Input } from "./Input";
import { InputIconButton } from "./InputIconButton";

type InputContainerProps = {
    align?: "left" | "right";
};

export const InputContainer = styled.div<InputContainerProps>`
  position: relative;

  ${Input} {
    padding-${props => props.align}: 40px;
  }

  ${InputIconButton} {
    ${props => props.align}: 0;
  }
`;

InputContainer.defaultProps = {
    align: "left",
};
