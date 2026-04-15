import { cn } from "@app/utils";
import type { ReactNode } from "react";

type SubviewHeaderTitleProps = {
	children?: ReactNode;
	className?: string;
};

export default function SubviewHeaderTitle({
	children,
	className,
}: SubviewHeaderTitleProps) {
	return <div className={cn("text-2xl font-bold", className)}>{children}</div>;
}
