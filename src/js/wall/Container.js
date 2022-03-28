import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, getFontWeight } from "../app/theme";
import { Button, VTLogo } from "../base";

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
    display: flex;
    align-items: stretch;
    flex: 0 1 450px;
    flex-direction: column;
`;

export const WallHeader = styled.div`
    font-size: ${getFontSize("xl")};
    font-weight: ${getFontWeight("bold")};
    margin-bottom: 20px;
    color: ${props => getColor({ theme: props.theme, color: "greyDarkest" })};
`;

export const WallSubheader = styled.div`
    margin-bottom: 5px;
    font-size: ${getFontSize("sm")};
    font-weight: ${getFontWeight("normal")};
    color: ${props => getColor({ theme: props.theme, color: "greyDark" })};
`;

export const WallButton = styled(Button)`
    width: 100%;
    margin-bottom: 10px;
`;

const StyledWallTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: max(calc(35vh - 200px), 0px);
    margin-bottom: 30px;
    font-size: ${getFontSize("xxl")};
    font-weight: ${getFontWeight("bold")};

    div {
        margin: 0 0;
    }
`;

export const WallTitle = () => (
    <StyledWallTitle>
        <VTLogo height={60} color="black" />
        Virtool
    </StyledWallTitle>
);
