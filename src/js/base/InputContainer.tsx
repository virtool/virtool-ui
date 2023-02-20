import styled from "styled-components/macro";
import { Input } from "./Input";
import { InputIcon } from "./InputIcon";

type InputContainerProps = {
    align: "left" | "right";
};

export const InputContainer = styled.div<InputContainerProps>`
  position: relative;

  ${Input} {
    padding-${props => props.align}: 40px;
  }

  ${InputIcon} {
    ${props => props.align}: 0;
  }
`;
