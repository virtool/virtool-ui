import { cn } from "@utils/utils";
import {
    FetchNextPageOptions,
    InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { map } from "lodash-es";
import React, { useEffect } from "react";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function getScrollRatio(): number {
    return (
        (window.innerHeight + window.scrollY) /
        document.documentElement.scrollHeight
    );
}

type ScrollListProps = {
    /** Tailwind CSS classes */
    className?: string;
    /** A function which initiates fetching the next page */
    fetchNextPage: (
        options?: FetchNextPageOptions,
    ) => Promise<InfiniteQueryObserverResult>;
    /** Whether there is another page of data available */
    hasNextPage: boolean;
    /** Whether a new page is being fetched */
    isFetchingNextPage: boolean;
    /** Whether the first page is being fetched */
    isPending: boolean;
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
    isPending,
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

    const entries = map(items, (item) => renderRow(item));

    return (
        <div className={cn("relative", "z-0", className)}>
            {entries}
            {isPending && <LoadingPlaceholder className="mt-5" />}
        </div>
    );
}
