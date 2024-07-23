import { cn } from "@utils/utils";
import React, { Component, ReactNode } from "react";

export type ButtonProps = {
    active?: boolean;
    as?: string | Component | IStyledComponent;
    children: ReactNode;
    className?: string;
    color?: "blue" | "green" | "gray" | "purple" | "red";
    disabled?: boolean;
    onBlur?: () => void;
    onClick?: () => void;
    size?: "small" | "large";
    type?: "button" | "submit";
};

export function Button({
    as = "button",
    children,
    className,
    color = "gray",
    disabled = false,
    size = "large",
    type = "button",
    onBlur,
    onClick,
}: ButtonProps) {
    const As = as;

    return (
        <As
            className={cn(
                className,
                {
                    "bg-blue-600": color === "blue",
                    "bg-red-600": color === "red",
                    "bg-green-600": color === "green",
                    "bg-gray-200": color === "gray",
                    "bg-purple-600": color === "purple",
                },
                "cursor-pointer",
                "gap-1.5",
                "items-center",
                "inline-flex",
                "font-medium",
                { "min-h-10": size === "large", "min-h-8": size === "small" },
                {
                    "opacity-50": disabled,
                    "opacity-100": !disabled,
                },
                "px-4",
                "rounded-md",
                "select-none",
                {
                    "text-black": ["gray"].includes(color),
                    "text-white": ["blue", "green", "purple", "red"].includes(color),
                },
                {
                    "text-lg": size === "large",
                    "text-sm": size === "small",
                },
                "hover:shadow-lg",
            )}
            disabled={disabled}
            onBlur={onBlur}
            onClick={onClick}
            type={type}
        >
            {children}
        </As>
    );
}
