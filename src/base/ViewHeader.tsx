import { ReactNode } from "react";
import styled from "styled-components";

const StyledViewHeader = styled.header`
    display: block;
    margin: 10px 0 20px;
`;

StyledViewHeader.displayName = "StyledViewHeader";

type ViewHeaderProps = {
    children?: ReactNode;
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
            <title>{title}</title>
            {children}
        </StyledViewHeader>
    );
}
