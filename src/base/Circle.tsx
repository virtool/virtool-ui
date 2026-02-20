import { cn } from "@app/utils";
import React from "react";
import { IconColor } from "./types";

export type CircleProps = {
    /** The color of the circle */
    color?: IconColor;
    /** The size of the circle in pixels */
    size?: number;
    /** Additional class names to apply to the circle */
    className?: string;
    /** Whether the circle should be full, empty, or half filled */
    fill?: "full" | "empty" | "half";
} & React.SVGProps<SVGSVGElement>;

/**
 * A simple circle component rendered as an SVG.
 */
export default function Circle({
    color = "black",
    size = 13,
    className,
    fill = "full",
    ...props
}: CircleProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "bg-inherit",
                "inline-block",
                {
                    "text-blue-500": color === "blue",
                    "text-black": color === "black",
                    "text-green-500": color === "green",
                    "text-gray-400": color === "gray" || color === "grey",
                    "text-gray-500": color === "grayDark",
                    "text-red-500": color === "red",
                    "text-orange-500": color === "orange",
                    "text-purple-500": color === "purple",
                },
                className,
            )}
            {...props}
        >
            {fill === "full" && (
                <circle cx="5" cy="5" r="5" fill="currentColor" />
            )}
            {fill === "half" && (
                <>
                    <path
                        d="M 5 0.5 A 4.5 4.5 0 0 0 5 9.5 Z"
                        fill="currentColor"
                    />
                    <circle
                        cx="5"
                        cy="5"
                        r="4.5"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                    />
                </>
            )}
            {fill === "empty" && (
                <circle
                    cx="5"
                    cy="5"
                    r="4.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                />
            )}
        </svg>
    );
}
