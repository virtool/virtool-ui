import { PaginationContent } from "@base/pagination/PaginationContent";
import { PaginationLink } from "@base/pagination/PaginationLink";
import { PaginationNext } from "@base/pagination/PaginationNext";
import { PaginationPrevious } from "@base/pagination/PaginationPrevious";
import { PaginationRoot } from "@base/pagination/PaginationRoot";
import { useUrlSearchParams } from "@utils/hooks";
import { map, max, min, range } from "lodash-es";
import React, { useEffect } from "react";

function getPageRange(pageCount, storedPage, leftButtons = 1, rightButtons = 2) {
    const totalButtons = leftButtons + rightButtons;
    let maxVal = min([pageCount, storedPage + rightButtons]);
    const minVal = max([1, maxVal - totalButtons]);
    maxVal = min([pageCount, minVal + totalButtons]);

    return range(minVal, maxVal + 1);
}

type PaginationProps = {
    children?: React.ReactNode;
    items: any[];
    renderRow?: (item: any) => JSX.Element;
    storedPage: number;
    currentPage: number;
    pageCount: number;
    onLoadNextPage?: (pageNumber: number) => void;
};

/**
 * A styled pagination component managing paginated data
 */
export function Pagination({
    children,
    items,
    renderRow,
    storedPage,
    currentPage,
    pageCount,
    onLoadNextPage,
}: PaginationProps) {
    onLoadNextPage = onLoadNextPage || (() => {});
    const [_, setUrlPage] = useUrlSearchParams<number>("page");

    const entries = renderRow && map(items, item => renderRow(item));

    const filters = new URLSearchParams(window.location.search);
    filters.delete("page");

    const pageButtons = map(getPageRange(pageCount, storedPage), pageNumber => (
        <PaginationLink
            key={pageNumber}
            to={`?page=${pageNumber}${filters.toString() ? `&${filters.toString()}` : ""}`}
            active={storedPage !== pageNumber}
            disabled={storedPage === pageNumber}
            onClick={() => onLoadNextPage(pageNumber)}
        >
            {pageNumber}
        </PaginationLink>
    ));

    useEffect(() => {
        if (currentPage > pageCount) {
            setUrlPage(pageCount);
        }
    }, [currentPage, pageCount]);

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
                            to={`?page=${currentPage - 1}${filters.toString() ? `&${filters.toString()}` : ""}`}
                            disabled={currentPage === 1}
                            active={currentPage !== 1}
                            onClick={() => onLoadNextPage(currentPage - 1)}
                        />
                        {pageButtons}
                        <PaginationNext
                            to={`?page=${currentPage + 1}${filters.toString() ? `&${filters.toString()}` : ""}`}
                            disabled={currentPage === pageCount}
                        />
                    </PaginationContent>
                </PaginationRoot>
            )}
        </div>
    );
}
