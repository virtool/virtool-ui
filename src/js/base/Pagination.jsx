import React, { useMemo } from "react";
import { Button } from "../base";
import styled from "styled-components";
import { range, min, max, map } from "lodash-es";

const StyledPaginationBox = styled.div`
    display: flex;
    width: 500px;
    justify-content: center;
    margin-left: 25%;

    button:first-child {
        width: 100px;
    }
    button:last-child {
        width: 100px;
    }

    button {
        margin: 5px;
        height: 25px;
    }
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

export const Pagination = ({ currentPage, pageCount, onPageChange }) => {
    const paginationRange = usePagination(pageCount, currentPage);

    const pageButtons = map(paginationRange, pageNumber => (
        <Button
            color={currentPage === pageNumber ? "blue" : ""}
            key={pageNumber}
            active={currentPage === pageNumber}
            onClick={() => onPageChange(pageNumber)}
        >
            {pageNumber}
        </Button>
    ));

    return (
        <StyledPaginationBox>
            <Button onClick={() => onPageChange(currentPage - 1)} color="blue" disabled={currentPage === 1}>
                Previous
            </Button>
            {pageButtons}
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                color="blue"
                disabled={currentPage === pageCount ? true : false}
            >
                Next
            </Button>
        </StyledPaginationBox>
    );
};
