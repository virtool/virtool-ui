import { cn } from "@/app/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const baseSampleLabelVariants = cva(
    "inline-flex items-center border rounded-md [&_i.fas]:mr-1 [&_i.fas]:text-[var(--user-color)]",
    {
        variants: {
            size: {
                sm: "text-sm font-semibold px-1.5 py-0.5 [&_i.fas]:mr-0.5",
                md: "text-base px-2 py-1",
            },
            variant: {
                default: "bg-white border-gray-300",
                library:
                    "bg-gray-200 border-gray-300 text-sm font-semibold px-1.5 py-0.5 [&_i.fas]:mr-0.5",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "default",
        },
    },
);

interface BaseSampleLabelProps extends VariantProps<
    typeof baseSampleLabelVariants
> {
    children: ReactNode;
    className?: string;
    color?: string;
    as?: ElementType;
}

/**
 * The base sample label component with variants
 */
export function BaseSampleLabel({
    children,
    className,
    color,
    size,
    variant,
    as: Component = "span",
    ...props
}: BaseSampleLabelProps & ComponentPropsWithoutRef<"span" | "button">) {
    const formattedColor = color?.startsWith("#")
        ? color
        : color
          ? `#${color}`
          : undefined;

    return (
        <Component
            className={cn(
                baseSampleLabelVariants({ size, variant }),
                className,
            )}
            style={
                {
                    "--user-color": formattedColor,
                } as React.CSSProperties
            }
            {...props}
        >
            {children}
        </Component>
    );
}
