import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

const StyledViewHeader = styled.header`
    display: block;
    margin: 10px 0 20px;
`;

StyledViewHeader.displayName = "StyledViewHeader";

type ViewHeaderProps = {
    children: React.ReactNode;
    className?: string;
    title: string;
};

export function ViewHeader({ className, title, children }: ViewHeaderProps) {
    return (
        <StyledViewHeader className={className}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}
        </StyledViewHeader>
    );
}

ViewHeader.displayName = "ViewHeader";
