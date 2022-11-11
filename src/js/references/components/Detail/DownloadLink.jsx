import React from "react";
import styled from "styled-components";

const StyledDownloadLink = styled.a`
    font-weight: 500;
`;

export const DownloadLink = ({ children, href }) => (
    <StyledDownloadLink href={href} download>
        {children}
    </StyledDownloadLink>
);
