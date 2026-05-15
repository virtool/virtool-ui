import { cn } from "@app/utils";
import { buttonVariants } from "./buttonVariants";
import PaginationItem from "./PaginationItem";

type PaginationNextProps = {
	className?: string;
	disabled?: boolean;
	onPageChange: (page: number) => void;
	page: number;
};

export default function PaginationNext({
	className,
	disabled,
	onPageChange,
	page,
}: PaginationNextProps) {
	return (
		<PaginationItem>
			<button
				aria-label="Go to next page"
				className={cn(
					buttonVariants({ color: "blue" }),
					"flex",
					"justify-center",
					"w-18",
					"text-white",
					{ "pointer-events-none": disabled },
					className,
				)}
				disabled={disabled}
				onClick={() => onPageChange(page)}
				type="button"
			>
				Next
			</button>
		</PaginationItem>
	);
}
