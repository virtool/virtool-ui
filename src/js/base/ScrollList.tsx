import { map } from "lodash-es";
import React, { useEffect } from "react";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
import styled from "styled-components";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function getScrollRatio(): number {
    return (window.innerHeight + window.scrollY) / document.documentElement.scrollHeight;
}

const StyledScrollList = styled.div`
    margin-bottom: 20px;
    position: relative;
    z-index: 0;
`;

type ScrollListProps = {
    /** The class name of the scroll list */
    className?: string;
    /** A function which initiates fetching the next page */
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    /** Whether there is another page of data available */
    hasNextPage: boolean;
    /** Whether a new page is being fetched */
    isFetchingNextPage: boolean;
    /** Whether the first page is being fetched */
    isLoading: boolean;
    /** The list of items */
    items: unknown[];
    /** A function which accepts an item and returns a React element */
    renderRow: (item: unknown) => void;
};

/**
 * An infinitely scrolling list of items.
 */
export function ScrollList({
    className,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    items,
    renderRow,
}: ScrollListProps) {
    useEffect(() => {
        handleFetchNextPage();

        function handleFetchNextPage() {
            if (getScrollRatio() > 0.8 && !isFetchingNextPage && hasNextPage) {
                void fetchNextPage();
            }
        }

        window.addEventListener("scroll", handleFetchNextPage);
        return () => window.removeEventListener("scroll", handleFetchNextPage);
    }, [isFetchingNextPage, fetchNextPage]);

    const entries = map(items, item => renderRow(item));

    return (
        <StyledScrollList className={className}>
            {entries}
            {isLoading && <LoadingPlaceholder margin="20px" />}
        </StyledScrollList>
    );
}
