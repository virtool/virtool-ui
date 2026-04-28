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
	onPageChange?: (page: number) => void;
};

export default function Pagination({
	children,
	currentPage,
	items,
	onPageChange = () => {},
	pageCount,
	renderRow,
	storedPage,
}: PaginationProps) {
	useEffect(() => {
		if (currentPage > pageCount) {
			onPageChange(pageCount);
		}
	}, [currentPage, onPageChange, pageCount]);

	const entries = renderRow && items.map((item) => renderRow(item));

	const pageButtons = getPageRange(pageCount, storedPage).map((pageNumber) => (
		<PaginationLink
			key={pageNumber}
			page={pageNumber}
			active={storedPage !== pageNumber}
			disabled={storedPage === pageNumber}
			onPageChange={onPageChange}
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
							onPageChange={onPageChange}
						/>
						{pageButtons}
						<PaginationNext
							page={currentPage + 1}
							disabled={currentPage === pageCount}
							onPageChange={onPageChange}
						/>
					</PaginationContent>
				</PaginationRoot>
			)}
		</div>
	);
}
