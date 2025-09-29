import { cn } from "@app/utils";
import { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

/**
 * Main page content container
 */
export default function Container({ children, className }: ContainerProps) {
    return (
        <div
            className={cn("max-w-full", "px-9", "pl-28", "w-screen", className)}
        >
            {children}
        </div>
    );
}
