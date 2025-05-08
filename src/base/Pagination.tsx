import { updateSearchParam, usePageParam } from "@app/hooks";
import { map, max, min, range } from "lodash-es";
import React, { ReactElement, useEffect } from "react";
import { useSearch } from "wouter";
import PaginationContent from "./PaginationContent";
import PaginationLink from "./PaginationLink";
import PaginationNext from "./PaginationNext";
import PaginationPrevious from "./PaginationPrevious";
import PaginationRoot from "./PaginationRoot";

function getPageRange(
    pageCount,
    storedPage,
    leftButtons = 1,
    rightButtons = 2,
) {
    const totalButtons = leftButtons + rightButtons;
    let maxVal = min([pageCount, storedPage + rightButtons]);
    const minVal = max([1, maxVal - totalButtons]);
    maxVal = min([pageCount, minVal + totalButtons]);

    return range(minVal, maxVal + 1);
}

type PaginationProps = {
    children?: React.ReactNode;
    items: object[];
    renderRow?: (item: object) => ReactElement;
    storedPage: number;
    currentPage: number;
    pageCount: number;
    onLoadNextPage?: (pageNumber: number) => void;
};

/**
 * A styled pagination component managing paginated data
 */
export default function Pagination({
    children,
    items,
    renderRow,
    storedPage,
    currentPage,
    pageCount,
    onLoadNextPage,
}: PaginationProps) {
    const search = useSearch();
    onLoadNextPage = onLoadNextPage || (() => {});
    const { setPage } = usePageParam();

    useEffect(() => {
        if (currentPage > pageCount) {
            setPage(pageCount);
        }
    }, [currentPage, pageCount, setPage]);

    const entries = renderRow && map(items, (item) => renderRow(item));

    const pageButtons = map(
        getPageRange(pageCount, storedPage),
        (pageNumber) => (
            <PaginationLink
                key={pageNumber}
                to={updateSearchParam("page", String(pageNumber), search)}
                active={storedPage !== pageNumber}
                disabled={storedPage === pageNumber}
                onClick={() => onLoadNextPage(pageNumber)}
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
                            onClick={() => onLoadNextPage(currentPage - 1)}
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
