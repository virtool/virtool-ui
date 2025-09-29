import { cn } from "@app/utils";
import { ReactNode } from "react";

type ToolbarProps = {
    children: ReactNode;
    className?: string;
};

export default function Toolbar({ children, className }: ToolbarProps) {
    return (
        <div className={cn(className, "flex gap-2 items-stretch mb-3")}>
            {children}
        </div>
    );
}
