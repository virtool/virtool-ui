import DropdownMenuItem from "./DropdownMenuItem";
import React from "react";

export default function DropdownMenuDownload({ children, href }) {
    return (
        <DropdownMenuItem asChild>
            <a href={href} download>
                {children}
            </a>
        </DropdownMenuItem>
    );
}
