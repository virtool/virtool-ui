import { cn } from "@app/utils";
import { ReactNode } from "react";

type InputContainerProps = {
    align?: "left" | "right";
    children: ReactNode;
    className?: string;
};

export default function InputContainer({
    align = "left",
    children,
    className,
}: InputContainerProps) {
    return (
        <div
            className={cn(
                "relative",
                {
                    "[&>input]:!pl-10": align === "left",
                    "[&>input]:!pr-10": align === "right",
                    "[&>select]:!pl-10": align === "left",
                    "[&>select]:!pr-10": align === "right",
                    "[&>.absolute]:left-0": align === "left",
                    "[&>.absolute]:right-0": align === "right",
                },
                className,
            )}
        >
            {children}
        </div>
    );
}
