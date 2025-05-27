import { cn } from "@app/utils";
import React from "react";

export type DotColor = "blue" | "green" | "gray" | "red";

type DotProps = {
    color: DotColor;
};

export default function Dot({ color }: DotProps) {
    return (
        <div
            className={cn(
                {
                    "bg-blue-500": color === "blue",
                    "bg-green-600": color === "green",
                    "bg-gray-400": color === "gray",
                    "bg-red-600": color === "red",
                },
                "margin-full",
                "rounded-full",
                "size-2.5",
            )}
        />
    );
}
