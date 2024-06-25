import { FetchNextPageOptions, InfiniteQueryObserverResult } from "@tanstack/react-query/";
import { map } from "lodash-es";
import React from "react";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function getScrollRatio(scrollListElement: HTMLElement): number {
    return Math.round((scrollListElement.scrollTop + scrollListElement.clientHeight) / scrollListElement.scrollHeight);
}

type CompactScrollListProps = {
    /** The class name of the scroll list */
    className?: string;
    /** A function which initiates fetching the next page */
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
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
export function CompactScrollList({
    className,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    items,
    renderRow,
}: CompactScrollListProps) {
    function onScroll(e) {
        const scrollListElement = e.target;
        if (getScrollRatio(scrollListElement) > 0.8 && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }

    const entries = map(items, item => renderRow(item));

    return (
        <div className={`mb-5 relative z-0 overflow-y-auto ${className}`} onScroll={onScroll}>
            {entries}
            {isLoading && <LoadingPlaceholder margin="20px" />}
        </div>
    );
}
