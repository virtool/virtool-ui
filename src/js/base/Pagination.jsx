import React, { useMemo, useEffect } from "react";
import styled from "styled-components";
import { range, min, max, map } from "lodash-es";
import { Link, useHistory, useLocation } from "react-router-dom";
import { LinkButton } from "./Button";

const StyledPaginationBox = styled.div`
    display: flex;
    width: 500px;
    justify-content: center;
    margin-left: 25%;
    align-items: center;
`;

const StyledLink = styled(Link)`
    margin: 5px;
    font-size: ${props => props.theme.fontSize.lg};
    pointer-events: ${props => (props.disabled ? "none" : "")};
    color: ${props => (props.active === "true" ? props.theme.color.blue : props.theme.color.blueDarkest)};
`;

const StyledNextLink = styled(LinkButton)`
    display: flex;
    margin: 5px;
    width: 60px;params
    justify-content: center;
    pointer-events: ${props => (props.disabled ? "none" : "")};
`;

const StyledPaginationItemsContainer = styled.div`
    padding-bottom: 5px;
`;

const usePagination = (pageCount, currentPage) => {
    const paginationRange = useMemo(() => {
        const maxVal = min([pageCount + 1, currentPage + 4]);
        const minVal = max([1, maxVal - 4]);

        if (currentPage > 1 && currentPage < pageCount - 2) {
            return range(minVal - 1, maxVal - 1);
        }

        return range(minVal, maxVal);
    }, [pageCount, currentPage]);
    return paginationRange;
};

export const Pagination = ({ documents, renderRow, currentPage, pageCount, onLoadNextPage }) => {
    const paginationRange = usePagination(pageCount, currentPage);
    const location = useLocation();
    const page = new URLSearchParams(location.search).get("page");

    const history = useHistory();
    useEffect(() => {
        if (page > 1 && page > pageCount) {
            history.push({ search: `?page=${page - 1}` });
        } else {
            history.push({ search: `?page=${page}` });
        }
    }, [pageCount]);

    const entries = map(documents, (_, index) => renderRow(index));

    useEffect(() => {
        if (page !== currentPage) {
            onLoadNextPage(page);
        }
    }, [page]);

    const pageButtons = map(paginationRange, pageNumber => (
        <StyledLink
            key={pageNumber}
            to={`?page=${pageNumber}`}
            active={currentPage !== pageNumber ? "true" : "false"}
            disabled={currentPage === pageNumber}
        >
            {pageNumber}
        </StyledLink>
    ));

    return (
        <div>
            <StyledPaginationItemsContainer>{entries}</StyledPaginationItemsContainer>
            {pageCount > 1 && (
                <StyledPaginationBox>
                    <StyledLink
                        to={`?page=${currentPage - 1}`}
                        color="blue"
                        disabled={currentPage === 1}
                        active={currentPage !== 1 ? "true" : "false"}
                    >
                        Previous
                    </StyledLink>
                    {pageButtons}
                    <StyledNextLink
                        to={`?page=${currentPage + 1}`}
                        color="blue"
                        disabled={currentPage === pageCount || !pageCount}
                    >
                        Next
                    </StyledNextLink>
                </StyledPaginationBox>
            )}
        </div>
    );
};
