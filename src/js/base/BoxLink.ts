import { Link } from "react-router-dom";
import styled, { DefaultTheme } from "styled-components/macro";
import { getBorder } from "../app/theme";

type BoxLinkProps = {
    theme: DefaultTheme;
};

export const BoxLink = styled(Link)<BoxLinkProps>`
    border: ${getBorder};
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${props => props.theme.boxShadow.sm};
    box-sizing: border-box;
    color: ${props => props.theme.color.black};
    cursor: pointer;
    display: block;
    margin-bottom: 12px;
    padding: 10px 15px;
    position: relative;

    &:hover {
        background-color: ${props => props.theme.color.greyHover};
    }
`;
