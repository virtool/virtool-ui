import { usePageParam } from "@app/hooks";
import { range } from "es-toolkit/math";
import { type ReactElement, type ReactNode, useEffect } from "react";
import PaginationContent from "./PaginationContent";
import PaginationLink from "./PaginationLink";
import PaginationNext from "./PaginationNext";
import PaginationPrevious from "./PaginationPrevious";
import PaginationRoot from "./PaginationRoot";

function getPageRange(
	pageCount: number,
	storedPage: number,
	leftButtons = 1,
	rightButtons = 2,
) {
	const totalButtons = leftButtons + rightButtons;
	let maxVal = Math.min(pageCount, storedPage + rightButtons);
	const minVal = Math.max(1, maxVal - totalButtons);
	maxVal = Math.min(pageCount, minVal + totalButtons);

	return range(minVal, maxVal + 1);
}

type PaginationProps = {
	children?: ReactNode;
	items: object[];
	renderRow?: (item: object) => ReactElement;
	storedPage: number;
	currentPage: number;
	pageCount: number;
};

export default function Pagination({
	children,
	currentPage,
	items,
	pageCount,
	renderRow,
	storedPage,
}: PaginationProps) {
	const { setPage } = usePageParam();

	useEffect(() => {
		if (currentPage > pageCount) {
			setPage(pageCount);
		}
	}, [currentPage, pageCount, setPage]);

	const entries = renderRow && items.map((item) => renderRow(item));

	const pageButtons = getPageRange(pageCount, storedPage).map((pageNumber) => (
		<PaginationLink
			key={pageNumber}
			page={pageNumber}
			active={storedPage !== pageNumber}
			disabled={storedPage === pageNumber}
		>
			{pageNumber}
		</PaginationLink>
	));

	return (
		<div>
			<div className="pb-1.5">
				{entries}
				{children}
			</div>
			{pageCount > 1 && (
				<PaginationRoot>
					<PaginationContent>
						<PaginationPrevious
							page={currentPage - 1}
							disabled={currentPage === 1}
							active={currentPage !== 1}
						/>
						{pageButtons}
						<PaginationNext
							page={currentPage + 1}
							disabled={currentPage === pageCount}
						/>
					</PaginationContent>
				</PaginationRoot>
			)}
		</div>
	);
}
