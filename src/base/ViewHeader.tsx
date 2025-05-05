import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import styled from "styled-components";

const StyledViewHeader = styled.header`
    display: block;
    margin: 10px 0 20px;
`;

StyledViewHeader.displayName = "StyledViewHeader";

type ViewHeaderProps = {
    children?: React.ReactNode;
    className?: string;
    title: string;
};

export default function ViewHeader({
    className,
    title,
    children,
}: ViewHeaderProps) {
    return (
        <StyledViewHeader className={className}>
            <HelmetProvider>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                {children}
            </HelmetProvider>
        </StyledViewHeader>
    );
}
