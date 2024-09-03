import { OnlyChildrenProps } from "@/types";
import React from "react";

/**
 * A container for wall components that applies a max width to its children with
 * the brand background displayed on the excess space on the right.
 */
export function WallContainer({ children }: OnlyChildrenProps) {
    return (
        <div className="absolute bg-teal-600 flex items-center inset-0">
            <div className="bg-white flex flex-col h-full px-24">
                <div className="h-1/6" />
                <div className="w-96">{children}</div>
            </div>
        </div>
    );
}
