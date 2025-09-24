import { cn } from "@/app/utils";
import React from "react";

type SlashListProps = {
    children: React.ReactNode;
    className?: string;
};

function SlashList({ children, className }: SlashListProps) {
    return (
        <ul
            className={cn(
                "flex items-center list-none p-0 [&_li+li:before]:content-['/'] [&_li+li:before]:px-1",
                className,
            )}
        >
            {children}
        </ul>
    );
}

SlashList.displayName = "SlashList";

export default SlashList;
