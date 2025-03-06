import { IconColor } from "@jobs/types";
import { cn } from "@/utils";
import React from "react";
import { Tooltip } from "./Tooltip";

type IconButtonProps = {
    className?: string;
    color?: IconColor;
    faStyle?: "fas" | "far" | "fal" | "fab";
    name: string;
    onClick: () => void;
    tip: string;
    tipPlacement?: "top" | "right" | "bottom" | "left";
};

/**
 * A styled clickable icon with tooltip describing its action
 */
export function IconButton({
    className,
    color = "black",
    faStyle = "fas",
    name,
    onClick,
    tip,
    tipPlacement,
}: IconButtonProps) {
    const icon = (
        <button
            className={cn(
                faStyle,
                `fa-${name}`,
                "bg-inherit",
                "border-none",
                "cursor-pointer",
                "items-center",
                "outline-none",
                "p-2.5",
                "rounded-full",
                "text-inherit",
                "hover:text-white",
                "focus:text-white",

                {
                    "text-blue-500 hover:bg-blue-500 focus:bg-blue-400":
                        color === "blue",
                    "text-black hover:bg-black focus:bg-gray-800":
                        color === "black",
                    "text-green-500 hover:bg-green-500 focus:bg-green-400":
                        color === "green",
                    "text-gray-400 hover:bg-gray-400 focus:bg-gray-300":
                        color === "gray",
                    "text-gray-500 hover:bg-gray-500 focus:bg-gray-400":
                        color === "grayDark",
                    "text-red-500 hover:bg-red-500 focus:bg-red-400":
                        color === "red",
                    "text-orange-500 hover:bg-orange-500 focus:bg-orange-400":
                        color === "orange",
                    "text-purple-500 hover:bg-purple-500 focus:bg-purple-400":
                        color === "purple",
                },
                className,
            )}
            aria-label={tip}
            type="button"
            onClick={onClick}
        />
    );

    return (
        <Tooltip position={tipPlacement || "top"} tip={tip}>
            {icon}
        </Tooltip>
    );
}
