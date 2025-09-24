import React, { ReactNode } from "react";

type ExternalLinkProps = {
    children: ReactNode;
    className?: string;
    href: string;
};

function ExternalLink({ children, className = "", href }: ExternalLinkProps) {
    return (
        <a
            className={className}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
        >
            {children}
        </a>
    );
}

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
