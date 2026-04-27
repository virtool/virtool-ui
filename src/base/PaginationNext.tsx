import { cn } from "@app/utils";
import { buttonVariants } from "./buttonVariants";
import Link from "./Link";
import PaginationItem from "./PaginationItem";

type PaginationNextProps = {
	className?: string;
	disabled?: boolean;
	page: number;
};

export default function PaginationNext({
	className,
	disabled,
	page,
}: PaginationNextProps) {
	return (
		<PaginationItem>
			<Link
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
				to="."
				search={((prev: Record<string, unknown>) => ({ ...prev, page })) as any}
			>
				Next
			</Link>
		</PaginationItem>
	);
}
