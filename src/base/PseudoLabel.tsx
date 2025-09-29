import { cn } from "@app/utils";
import { ReactNode } from "react";

type PseudoLabelProps = {
    children: ReactNode;
    className?: string;
};

export default function PseudoLabel({ children, className }: PseudoLabelProps) {
    return (
        <label className={cn("font-medium", "mb-2", className)}>
            {children}
        </label>
    );
}
