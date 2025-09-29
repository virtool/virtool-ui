import { cn } from "@app/utils";
import { ElementType, ReactNode } from "react";

type BoxGroupSectionProps = {
    active?: boolean;
    as?: ElementType;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
};

export default function BoxGroupSection({
    as: Component = "div",
    children,
    className = "",
    ...props
}: BoxGroupSectionProps) {
    return (
        <Component
            className={cn(
                "bg-transparent",
                "block",
                "border-gray-300",
                "not-last:border-b-1",
                "py-3",
                "px-6",
                "relative",
                "text-inherit",
                "w-full",
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
