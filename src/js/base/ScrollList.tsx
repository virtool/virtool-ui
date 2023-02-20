import { map } from "lodash-es";
import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { usePrevious } from "./hooks";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

function getScrollRatio(): number {
    return Math.round((window.innerHeight + window.scrollY) / document.documentElement.scrollHeight);
}

const StyledScrollList = styled.div`
    padding-bottom: 20px;
    position: relative;
    z-index: 0;
`;

type ScrollListProps = {
    page: number;
    documents: any[];
    pageCount: number;
    onLoadNextPage: (page: number) => void;
    renderRow: (index: number) => React.ReactNode;
};

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
