import { map } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { usePrevious } from "./hooks";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function getScrollRatio(): number {
    return Math.round((window.innerHeight + window.scrollY) / document.documentElement.scrollHeight);
}

const StyledScrollList = styled.div`
    margin-bottom: 20px;
    position: relative;
    z-index: 0;
`;

type LegacyScrollListProps = {
    /** The most recently fetched page */
    page: number;
    /** The list of documents */
    documents: any[];
    /** The total number of pages */
    pageCount: number;
    /** The function that initiates fetching the next page of documents */
    onLoadNextPage: (page: number) => void;
    /** A function which accepts a document and returns a React element */
    renderRow: (index: number) => React.ReactNode;
};

/**
 * An infinitely scrolling list of documents.
 */
export function LegacyScrollList({ page, documents, pageCount, onLoadNextPage, renderRow }: LegacyScrollListProps) {
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

    return (
        <StyledScrollList>
            {entries}
            {documents === null && page < pageCount && <LoadingPlaceholder margin="20px" />}
        </StyledScrollList>
    );
}
