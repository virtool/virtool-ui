import { map } from "lodash-es";
import React, { useEffect, useState } from "react";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
import styled from "styled-components";
import { usePrevious } from "./hooks";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function getScrollRatio(): number {
    return Math.round((window.innerHeight + window.scrollY) / document.documentElement.scrollHeight);
}

type ScrollListProps = {
    page: number;
    documents: any[];
    pageCount: number;
    onLoadNextPage: (page: number) => void;
    renderRow: (index: number) => React.ReactNode;
};

const StyledScrollList = styled.div`
    padding-bottom: 20px;
    position: relative;
    z-index: 0;
`;

export const ScrollList = ({ page, documents, pageCount, onLoadNextPage, renderRow }: ScrollListProps) => {
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

type StreamlinedScrollListProps = {
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    items: unknown[];
    renderRow: (item: unknown) => void;
};
export const StreamlinedScrollList = ({
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    items,
    renderRow,
}: StreamlinedScrollListProps) => {
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

    let loading;

    if (isLoading) {
        loading = <LoadingPlaceholder margin="20px" />;
    }

    return (
        <StyledScrollList>
            {entries}
            {loading}
        </StyledScrollList>
    );
};
