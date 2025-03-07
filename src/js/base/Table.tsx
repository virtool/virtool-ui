import { cn } from "@/utils";
import React from "react";

type TableProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Replacement for the HTML table element
 */
export default function Table({ children, className }: TableProps) {
    return (
        <table
            className={cn(
                "w-full",
                "border-collapse",
                "bg-white",
                "shadow-sm",
                "rounded-md",
                "overflow-hidden",
                "[&_th]:font-semibold",
                "[&_th]:text-left",
                "[&_th]:p-3",
                "[&_td]:p-2",
                "[&_tr]:border-b",
                "[&_tr]:border-gray-200",
                "[&_tr:last-child]:border-b-0",
                "[&_th:first-child]:w-1/5",
                "[&_td,&_th]:align-top",
                "[&_td:first-child]:border-r",
                "[&_td:first-child]:border-gray-200",
                "[&_th:first-child]:border-r",
                "[&_th:first-child]:border-gray-200",
                className,
            )}
        >
            {children}
        </table>
    );
}
