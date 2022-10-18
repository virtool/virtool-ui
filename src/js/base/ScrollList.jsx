import { map } from "lodash-es";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { usePrevious } from "./hooks";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

export const getScrollRatio = () =>
    ((window.innerHeight + window.scrollY) / document.documentElement.scrollHeight).toFixed(1);

const StyledScrollList = styled.div`
    padding-bottom: 20px;
    position: relative;
    z-index: 0;
`;

export const ScrollList = ({ page, documents, pageCount, onLoadNextPage, renderRow }) => {
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
