import React, { useCallback } from "react";
import { Input } from "./Input";

const colors: string[] = [
    // Grey
    "D1D5DB",
    "6B7280",
    "374151",

    // Red
    "FCA5A5",
    "EF4444",
    "B91C1C",

    // Yellow
    "FCD34D",
    "F59E0B",
    "B45309",

    // Green
    "6EE7B7",
    "10B981",
    "047857",

    // Blue
    "93C5FD",
    "3B82F6",
    "1D4ED8",

    // Indigo
    "A5B4FC",
    "6366F1",
    "4338CA",

    // Purple
    "C4B5FD",
    "8B5CF6",
    "5B21B6",

    // Pink
    "FBCFE8",
    "F472B6",
    "EC4899",
];

type ColorSquareProps = {
    // The color in hex format
    color: string;
    // The callback to be called when the color is clicked
    onClick: (color: string) => void;
};

/**
 * A color square that updates the color input when clicked
 */
function ColorSquare({ color, onClick }: ColorSquareProps) {
    const handleClick = useCallback(() => onClick(color), [color, onClick]);

    return (
        <button
            type="button"
            title={color}
            onClick={handleClick}
            className={`flex-1 h-full transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 focus:z-10 first:rounded-l-sm last:rounded-r-sm`}
            style={{ backgroundColor: `#${color}` }}
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
            <div className="flex h-9 mt-2.5">
                {colors.map(color => (
                    <ColorSquare key={color} color={`#${color}`} onClick={onChange} />
                ))}
            </div>
        </div>
    );
}
