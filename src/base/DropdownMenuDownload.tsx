import React from "react";
import DropdownMenuItem from "./DropdownMenuItem";

export default function DropdownMenuDownload({ children, href }) {
    return (
        <DropdownMenuItem asChild>
            <a href={href} download>
                {children}
            </a>
        </DropdownMenuItem>
    );
}
