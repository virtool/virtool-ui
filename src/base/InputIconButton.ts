import styled from "styled-components";
import IconButton from "./IconButton";

const InputIconButton = styled(IconButton)`
    align-items: center;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 6px;
    margin: 0 6px;
`;

InputIconButton.displayName = "InputIconButton";

export default InputIconButton;
