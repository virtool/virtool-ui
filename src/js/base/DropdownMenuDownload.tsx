import { DropdownMenuItem } from "@base/DropdownMenuItem";
import React from "react";

export function DropdownMenuDownload({ children, href }) {
    return (
        <DropdownMenuItem asChild>
            <a href={href} download>
                {children}
            </a>
        </DropdownMenuItem>
    );
}
