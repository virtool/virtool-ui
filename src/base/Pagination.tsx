import { updateSearchParam, usePageParam } from "@app/hooks";
import { range } from "es-toolkit/math";
import { ReactElement, ReactNode, useEffect } from "react";
import { useSearch } from "wouter";
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

/**
 * A styled pagination component managing paginated data
 */
export default function Pagination({
    children,
    currentPage,
    items,
    pageCount,
    renderRow,
    storedPage,
}: PaginationProps) {
    const search = useSearch();
    const { setPage } = usePageParam();

    useEffect(() => {
        if (currentPage > pageCount) {
            setPage(pageCount);
        }
    }, [currentPage, pageCount, setPage]);

    const entries = renderRow && items.map((item) => renderRow(item));

    const pageButtons = getPageRange(pageCount, storedPage).map(
        (pageNumber) => (
            <PaginationLink
                key={pageNumber}
                to={updateSearchParam("page", String(pageNumber), search)}
                active={storedPage !== pageNumber}
                disabled={storedPage === pageNumber}
            >
                {pageNumber}
            </PaginationLink>
        ),
    );

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
                            to={updateSearchParam(
                                "page",
                                String(currentPage - 1),
                                search,
                            )}
                            disabled={currentPage === 1}
                            active={currentPage !== 1}
                        />
                        {pageButtons}
                        <PaginationNext
                            to={updateSearchParam(
                                "page",
                                String(currentPage + 1),
                                search,
                            )}
                            disabled={currentPage === pageCount}
                        />
                    </PaginationContent>
                </PaginationRoot>
            )}
        </div>
    );
}
