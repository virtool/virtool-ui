import { cn } from "@app/utils";
import PaginationLink from "./PaginationLink";

type PaginationPreviousProps = {
	active?: boolean;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
	page: number;
};

export default function PaginationPrevious({
	active,
	className,
	disabled,
	onClick,
	page,
}: PaginationPreviousProps) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			className={cn("gap-1 pl-2.5", className)}
			active={active}
			disabled={disabled}
			onClick={onClick}
			page={page}
		>
			Previous
		</PaginationLink>
	);
}
