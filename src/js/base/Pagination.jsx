import React, { useState } from "react";
import { Button } from "../base";
import styled from "styled-components";
import { range } from "lodash-es";

const StyledPaginationBox = styled.div`
    justify-content: center;
    display: flex;
    width: 500px;
    margin-left: 25%;
    margin-right: 25%;
    button:first-of-type {
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

export const sliceData = (items, currentPage, itemsPerPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
};

const getPagesToDisplay = (pageNumbers, currentPage) => {
    if (pageNumbers.length <= 4) {
        return pageNumbers;
    } else if (currentPage === 1) {
        return pageNumbers.slice(0, 4);
    } else if (currentPage === pageNumbers.length) {
        return pageNumbers.slice(pageNumbers.length - 4, pageNumbers.length);
    } else if (currentPage === pageNumbers.length - 1) {
        return pageNumbers.slice(currentPage - 3, currentPage + 1);
    }
    return pageNumbers.slice(currentPage - 2, currentPage + 2);
};

export const Pagination = ({ itemsPerPage, totalItems, color }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const paginate = number => setCurrentPage(number);

    const pageNumbers = range(1, Math.ceil(totalItems / itemsPerPage + 1));
    const pageNumbersToDisplay = getPagesToDisplay(pageNumbers, currentPage);

    const pageButtons = pageNumbersToDisplay.map(pageNumber => (
        <Button
            color={currentPage === pageNumber ? color : ""}
            key={pageNumber}
            active={currentPage === pageNumber ? true : false}
            onClick={() => paginate(pageNumber)}
        >
            {pageNumber}
        </Button>
    ));

    return (
        <StyledPaginationBox size={pageNumbers.length}>
            <Button onClick={() => paginate(currentPage - 1)} color={color} disabled={currentPage === 1 ? true : false}>
                {"< Previous"}
            </Button>
            {pageButtons}
            <Button
                onClick={() => paginate(currentPage + 1)}
                color={color}
                disabled={currentPage === pageNumbers.length ? true : false}
            >
                {"Next >"}
            </Button>
        </StyledPaginationBox>
    );
};
