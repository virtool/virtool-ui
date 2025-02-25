import React, { ReactNode } from "react";
import styled from "styled-components";

type ExternalLinkProps = {
    children: ReactNode;
    className?: string;
    href: string;
};

export const ExternalLink = styled(
    ({ children, className = "", href }: ExternalLinkProps) => (
        <a
            className={className}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
        >
            {children}
        </a>
    ),
)``;

ExternalLink.displayName = "ExternalLink";
