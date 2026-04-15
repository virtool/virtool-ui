import { cn } from "@app/utils";
import type { ReactNode } from "react";

type SubviewHeaderProps = {
	children?: ReactNode;
	className?: string;
};

export default function SubviewHeader({
	children,
	className,
}: SubviewHeaderProps) {
	return <div className={cn("mb-4", className)}>{children}</div>;
}
