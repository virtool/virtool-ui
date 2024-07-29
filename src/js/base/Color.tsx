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

type StyledColorProps = {
    children: React.ReactNode;
};

function StyledColor({ children }: StyledColorProps) {
    return <div className="flex flex-col w-full">{children}</div>;
}

type ColorSquareProps = {
    // The color value of the square
    color: string;
    // Callback function for color square click
    onClick: (color: string) => void;
};

function ColorSquare({ color, onClick }: ColorSquareProps) {
    const handleClick = useCallback(() => onClick(color), [color, onClick]);

    return (
        <button
            className={`
                bg-[#${color}] flex-1 flex-shrink-0 w-auto transform translate-y-0
                hover:-translate-y-0.5 focus:shadow-lg focus:outline-white focus:outline-2 focus:z-10
                first:rounded-l-sm last:rounded-r-sm
                transition-transform duration-200 ease-in-out
            `}
            type="button"
            title={color}
            onClick={handleClick}
        />
    );
}

type ColorGridProps = {
    children: React.ReactNode;
};

function ColorGrid({ children }: ColorGridProps) {
    return <div className="grid grid-cols-3 gap-2.5 mt-2.5">{children}</div>;
}

type ColorProps = {
    // The unique identifier for the color input
    id: string;
    // The value of the color input
    value: string;
    // Callback function for color input value change
    onChange: (value: string) => void;
};

export function Color({ id, value, onChange }: ColorProps) {
    return (
        <StyledColor>
            <Input
                id={id}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            />
            <ColorGrid>
                {colors.map(color => (
                    <ColorSquare key={color} color={color} onClick={onChange} />
                ))}
            </ColorGrid>
        </StyledColor>
    );
}
