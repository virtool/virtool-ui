import { cn } from "@app/utils";
import { LucideIcon } from "lucide-react";
import { IconColor } from "./types";

export type IconProps = {
    color?: IconColor;
    icon: LucideIcon;
    className?: string;
    size?: number;
};

export default function Icon({
    color,
    icon: LucideIcon,
    className,
    size = 18,
    ...props
}: IconProps) {
    return (
        <LucideIcon
            className={cn(
                "bg-inherit",
                "border-none",
                "text-inherit",
                "inline-block",
                "align-middle",
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
                className,
            )}
            size={size}
            {...props}
        />
    );
}
