import { map } from "lodash-es";
import React, { useEffect, useState } from "react";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
import styled from "styled-components";
import { getBorder } from "../app/theme";
import { usePrevious } from "./hooks";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function getScrollRatio(): number {
    return Math.round((window.innerHeight + window.scrollY) / document.documentElement.scrollHeight);
}

const StyledScrollList = styled.div`
    margin-bottom: 20px;
    position: relative;
    z-index: 0;

    &.border {
        border: ${getBorder};
        border-radius: ${props => props.theme.borderRadius.sm};
    }
`;

type ScrollListProps = {
    className?: string;
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    items: unknown[];
    renderRow: (item: unknown) => void;
};

/**
 * An infinitely scrolling list of items.
 *
 * @param className - The class name of the scroll list
 * @param fetchNextPage - A function which initiates fetching the next page
 * @param isFetchingNextPage - Whether a new page is being fetched
 * @param isLoading - Whether the first page is being fetched
 * @param items - The list of items
 * @param renderRow - A function which accepts an item and returns a react element
 * @returns An infinitely scrolling list of items
 */

export const ScrollList = ({
    className,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    items,
    renderRow,
}: ScrollListProps) => {
    useEffect(() => {
        const onScroll = () => {
            if (getScrollRatio() > 0.8 && !isFetchingNextPage) {
                void fetchNextPage();
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isFetchingNextPage, fetchNextPage]);

    const entries = map(items, item => renderRow(item));

    return (
        <StyledScrollList className={className}>
            {entries}
            {isLoading && <LoadingPlaceholder margin="20px" />}
        </StyledScrollList>
    );
};

type LegacyScrollListProps = {
    page: number;
    documents: any[];
    pageCount: number;
    onLoadNextPage: (page: number) => void;
    renderRow: (index: number) => React.ReactNode;
};

/**
 * An infinitely scrolling list of documents.
 *
 * @param page - The most recently fetched page
 * @param documents - The list of documents
 * @param pageCount - The total number of pages
 * @param onLoadNextPage - The function that initiates fetching the next page of documents
 * @param renderRow - A function which accepts a document and returns a react element
 * @returns An infinitely scrolling list of documents
 */
export const LegacyScrollList = ({ page, documents, pageCount, onLoadNextPage, renderRow }: LegacyScrollListProps) => {
    const [prevRequestedPage, setPrevRequestedPage] = useState(1);
    const prevPage = usePrevious(page);

    useEffect(() => {
        if (page === 1 && prevPage > page) {
            setPrevRequestedPage(1);
        }

        const onScroll = () => {
            if (page + 1 !== prevRequestedPage && documents.length && page < pageCount && getScrollRatio() > 0.8) {
                setPrevRequestedPage(page + 1);
                onLoadNextPage(page + 1);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [prevRequestedPage, setPrevRequestedPage, onLoadNextPage, page, documents]);

    const entries = map(documents, (item, index) => renderRow(index));

    let loading;

    if (documents === null && page < pageCount) {
        loading = <LoadingPlaceholder margin="20px" />;
    }

    return (
        <StyledScrollList>
            {entries}
            {loading}
        </StyledScrollList>
    );
};

StyledScrollList.displayName = "ScrollList";
