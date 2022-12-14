import React from "react";
import styled from "styled-components";
import { Icon } from "./Icon";

const StyledButton = styled(Icon)`
    color: inherit;
`;

export const CloseButton = ({ onClick }) => <StyledButton aria-label="close" name="times" onClick={onClick} />;
