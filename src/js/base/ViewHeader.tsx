import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components/macro";

const StyledViewHeader = styled.div`
    display: block;
    margin: 10px 0 20px;
`;

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
