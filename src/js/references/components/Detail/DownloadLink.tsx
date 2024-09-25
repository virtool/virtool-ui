import React, { ReactNode } from "react";

export type DownloadLinkProps = {
    children: ReactNode;
    href: string;
};

export function DownloadLink({ children, href }: DownloadLinkProps) {
    return (
        <a className="font-medium" href={href} download>
            {children}
        </a>
    );
}
