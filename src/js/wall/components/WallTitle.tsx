import { Logo } from "@base";
import React from "react";
import styled from "styled-components";

const StyledWallTitle = styled.h1`
    align-items: center;
    display: flex;
    justify-content: center;
    margin-top: max(calc(35vh - 200px), 0px);
    margin-bottom: 30px;

    div {
        margin: 0 0;
    }
`;
export function WallTitle() {
    return (
        <StyledWallTitle>
            <Logo height={60} color="black" />
            Virtool
        </StyledWallTitle>
    );
}
