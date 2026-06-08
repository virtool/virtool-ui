import { cn } from "@app/utils";
import type { ReactNode } from "react";

type PseudoLabelProps = {
	children: ReactNode;
	className?: string;
};

export default function PseudoLabel({ children, className }: PseudoLabelProps) {
	return <div className={cn("font-medium", "mb-2", className)}>{children}</div>;
}
