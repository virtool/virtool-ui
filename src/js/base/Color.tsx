import { cn } from "@utils/utils";
import React, { useCallback } from "react";
import { Input } from "./Input";

const colors = [
    { name: "Gray 1", class: "bg-gray-200" },
    { name: "Gray 2", class: "bg-gray-500" },
    { name: "Gray 3", class: "bg-gray-700" },
    { name: "Red 1", class: "bg-red-200" },
    { name: "Red 2", class: "bg-red-500" },
    { name: "Red 3", class: "bg-red-700" },
    { name: "Yellow 1", class: "bg-yellow-300" },
    { name: "Yellow 2", class: "bg-yellow-500" },
    { name: "Yellow 3", class: "bg-yellow-700" },
    { name: "Green 1", class: "bg-green-300" },
    { name: "Green 2", class: "bg-green-500" },
    { name: "Green 3", class: "bg-green-700" },
    { name: "Blue 1", class: "bg-blue-300" },
    { name: "Blue 2", class: "bg-blue-500" },
    { name: "Blue 3", class: "bg-blue-700" },
    { name: "Indigo 1", class: "bg-indigo-300" },
    { name: "Indigo 2", class: "bg-indigo-500" },
    { name: "Indigo 3", class: "bg-indigo-700" },
    { name: "Purple 1", class: "bg-purple-300" },
    { name: "Purple 2", class: "bg-purple-500" },
    { name: "Purple 3", class: "bg-purple-700" },
    { name: "Pink 1", class: "bg-pink-200" },
    { name: "Pink 2", class: "bg-pink-400" },
    { name: "Pink 3", class: "bg-pink-600" },
];

type ColorSquareProps = {
    // The color in hex format
    color: { name: string; class: string };
    // The callback to be called when the color is clicked
    onClick: (color: string) => void;
};

/**
 * A color square that updates the color input when clicked
 */
function ColorSquare({ color, onClick }: ColorSquareProps) {
    const handleClick = useCallback(() => onClick(color.name), [color.name, onClick]);

    return (
        <button
            type="button"
            title={color.name}
            onClick={handleClick}
            className={cn(
                "flex-1",
                "h-full",
                "transition-transform",
                "hover:-translate-y-0.5",
                "focus:outline-none",
                "focus:ring-2",
                "focus:ring-white",
                "focus:ring-offset-2",
                "focus:ring-offset-gray-300",
                "focus:z-10",
                "first:rounded-l-sm",
                "last:rounded-r-sm",
                color.class
            )}
        />
    );
}

type ColorProps = {
    // The id of the input
    id: string;
    // The value of the input (color in hex format)
    value: string;
    // The callback to be called when the value changes
    onChange: (value: string) => void;
};

/**
 * A color text input with a color picker below it
 */
export function Color({ id, value, onChange }: ColorProps) {
    return (
        <div>
            <Input
                id={id}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            />
            <div className={cn("flex", "h-9", "mt-2.5")}>
                {colors.map(color => (
                    <ColorSquare key={color.name} color={color} onClick={onChange} />
                ))}
            </div>
        </div>
    );
}
