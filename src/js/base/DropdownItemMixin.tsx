import { css } from "styled-components";

export const DropdownItemMixin = css`
    color: ${(props) => props.theme.color.black};
    cursor: pointer;
    min-width: 160px;
    padding: 10px 15px;

    &:hover {
        background-color: ${(props) => props.theme.color.greyHover};
        color: ${(props) => props.theme.color.black};
    }
`;
