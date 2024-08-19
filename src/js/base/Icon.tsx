import { IconColor } from "@jobs/types";
import { cn } from "@utils/utils";
import React from "react";

type IconProps = {
    "aria-label"?: string;
    color?: IconColor;
    name: string;
    className?: string;
    faStyle?: "fas" | "far" | "fal" | "fab";
    fixedWidth?: boolean;
    style?: any;
    title?: string;
};

export function Icon({ color, faStyle = "fas", fixedWidth = false, style, title, ...props }: IconProps) {
    const className = `${props.className ? props.className + " " : ""} ${faStyle} fa-${props.name}`;

    return (
        <i
            className={cn(
                "bg-inherit",
                "border-none",
                "text-inherit",
                {
                    "text-blue-500": color === "blue",
                    "text-black": color === "black",
                    "text-green-500": color === "green",
                    "text-gray-400": color === "gray",
                    "text-gray-500": color === "grayDark",
                    "text-red-500": color === "red",
                    "text-orange-500": color === "orange",
                    "text-purple-500": color === "purple",
                },
                { "w-2 text-center inline-block": fixedWidth },
                className
            )}
            aria-label={props["aria-label"]}
            style={style}
            title={title}
        />
    );
}
