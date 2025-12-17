import { DropdownMenu } from "radix-ui";
import styled from "styled-components";

const DropdownMenuItem = styled(DropdownMenu.Item)`
    color: ${(props) => props.theme.color.black};
    cursor: pointer;
    min-width: 160px;
    padding: 10px 15px;

    &:hover {
        background-color: ${(props) => props.theme.color.greyHover};
        color: ${(props) => props.theme.color.black};
    }
`;

export default DropdownMenuItem;
