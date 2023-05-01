import styled from "styled-components";
import { getFontWeight } from "../app/theme";
import { Button } from "../base";

export const WallContainer = styled.div`
    align-items: center;
    background-color: ${props => props.theme.color.primary};
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

export const WallDialog = styled.div`
    background-color: ${props => props.theme.color.white};
    border: none;
    display: flex;
    flex: 0 1 600px;
    flex-direction: row;
    justify-content: center;
    overflow: hidden;
    height: 100%;
`;

export const WallLoginContainer = styled.div`
    align-items: stretch;
    display: flex;
    flex: 0 1 450px;
    flex-direction: column;
`;

export const WallHeader = styled.h2``;

export const WallSubheader = styled.div`
    color: ${props => props.theme.color.greyDarkest};
    margin-bottom: 1rem;
    font-weight: ${getFontWeight("thick")};
`;

export const WallButton = styled(Button)`
    width: 100%;
    margin-bottom: 10px;
`;
