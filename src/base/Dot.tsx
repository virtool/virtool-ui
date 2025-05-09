import { cn } from "@app/utils";
import React from "react";

type DotProps = {
    color: string;
};

export default function Dot({ color }: DotProps) {
    return (
        <div
            className={cn(
                {
                    "bg-blue-500": color === "blue",
                    "bg-green-600": color === "green",
                    "bg-gray-600": color === "gray",
                    "bg-red-600": color === "red",
                },
                "margin-full",
                "rounded-full",
                "size-2.5",
            )}
        />
    );
}
