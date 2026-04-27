import { cn } from "@app/utils";
import type { ReactNode } from "react";
import Link from "./Link";
import PaginationItem from "./PaginationItem";

type PaginationLinkProps = {
	active?: boolean;
	children?: ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
	page: number;
};

export default function PaginationLink({
	active,
	children,
	className,
	disabled,
	onClick,
	page,
}: PaginationLinkProps) {
	return (
		<PaginationItem>
			<Link
				aria-current={active ? "page" : undefined}
				className={cn(
					"text-lg",
					"text-blue-500",
					{
						"text-blue-900": !active,
						"pointer-events-none": disabled,
					},
					className,
				)}
				to="."
				search={((prev: Record<string, unknown>) => ({ ...prev, page })) as any}
				onClick={onClick}
			>
				{children}
			</Link>
		</PaginationItem>
	);
}
