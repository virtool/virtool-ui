import React from "react";
import styled from "styled-components";
import { map, max, min, range } from "lodash-es";
import { Link } from "react-router-dom";
import { LinkButton } from "./Button";

import { getColor, getFontSize } from "../app/theme";

const StyledPaginationBox = styled.div`
    display: flex;
    width: 500px;
    justify-content: center;
    margin-left: 25%;
    align-items: center;
`;

const StyledLink = styled(Link)`
    margin: 5px;
    font-size: ${getFontSize("lg")};
    pointer-events: ${props => (props.disabled ? "none" : "")};
    color: ${props => getColor({ color: props.$active ? "blue" : "blueDarkest", theme: props.theme })};
`;

const StyledNextLink = styled(LinkButton)`
    display: flex;
    margin: 5px;
    width: 60px;
    justify-content: center;
    pointer-events: ${props => (props.disabled ? "none" : "")};
`;

const StyledPaginationItemsContainer = styled.div`
    padding-bottom: 5px;
`;

const getPageRange = (pageCount, storedPage, leftButtons = 1, rightButtons = 2) => {
    const totalButtons = leftButtons + rightButtons;
    let maxVal = min([pageCount, storedPage + rightButtons]);
    const minVal = max([1, maxVal - totalButtons]);
    maxVal = min([pageCount, minVal + totalButtons]);

    return range(minVal, maxVal + 1);
};

export const Pagination = ({ items, renderRow, storedPage, currentPage, pageCount, onLoadNextPage }) => {
    const entries = map(items, item => renderRow(item));

    const pageButtons = map(getPageRange(pageCount, storedPage), pageNumber => (
        <StyledLink
            key={pageNumber}
            to={`?page=${pageNumber}`}
            $active={storedPage !== pageNumber}
            disabled={storedPage === pageNumber}
            onClick={() => onLoadNextPage(pageNumber)}
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
                        $active={currentPage !== 1}
                        onClick={() => onLoadNextPage(currentPage - 1)}
                    >
                        Previous
                    </StyledLink>
                    {pageButtons}
                    <StyledNextLink
                        to={`?page=${currentPage + 1}`}
                        color="blue"
                        disabled={currentPage === pageCount}
                        onClick={() => onLoadNextPage(currentPage + 1)}
                    >
                        Next
                    </StyledNextLink>
                </StyledPaginationBox>
            )}
        </div>
    );
};
