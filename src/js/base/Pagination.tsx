import { map, max, min, range } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getColor, getFontSize } from "../app/theme";
import { LinkButton } from "./LinkButton";

const PaginationBox = styled.div`
    display: flex;
    width: 500px;
    justify-content: center;
    margin-left: 25%;
    align-items: center;
`;

const PaginationContainer = styled.div`
    padding-bottom: 5px;
`;

const PaginationLink = styled(Link)`
    color: ${props => getColor({ color: props.$active ? "blue" : "blueDarkest", theme: props.theme })};
    font-size: ${getFontSize("lg")};
    margin: 5px;
    pointer-events: ${props => (props.disabled ? "none" : "")};
`;

interface PaginationNextLinkProps {
    color: string;
    disabled?: boolean;
    to: string;
}

const PaginationNextLink = styled(LinkButton)<PaginationNextLinkProps>`
    display: flex;
    justify-content: center;
    margin: 5px;
    pointer-events: ${props => (props.disabled ? "none" : "")};
    width: 60px;
`;

function getPageRange(pageCount, storedPage, leftButtons = 1, rightButtons = 2) {
    const totalButtons = leftButtons + rightButtons;
    let maxVal = min([pageCount, storedPage + rightButtons]);
    const minVal = max([1, maxVal - totalButtons]);
    maxVal = min([pageCount, minVal + totalButtons]);

    return range(minVal, maxVal + 1);
}

interface PaginationProps {
    items: any[];
    renderRow: (item: any) => JSX.Element;
    storedPage: number;
    currentPage: number;
    pageCount: number;
    onLoadNextPage: (pageNumber: number) => void;
}

export const Pagination = ({
    items,
    renderRow,
    storedPage,
    currentPage,
    pageCount,
    onLoadNextPage
}: PaginationProps) => {
    const entries = map(items, item => renderRow(item));

    const pageButtons = map(getPageRange(pageCount, storedPage), pageNumber => (
        <PaginationLink
            key={pageNumber}
            to={`?page=${pageNumber}`}
            $active={storedPage !== pageNumber}
            disabled={storedPage === pageNumber}
            onClick={() => onLoadNextPage(pageNumber)}
        >
            {pageNumber}
        </PaginationLink>
    ));

    return (
        <div>
            <PaginationContainer>{entries}</PaginationContainer>
            {pageCount > 1 && (
                <PaginationBox>
                    <PaginationLink
                        to={`?page=${currentPage - 1}`}
                        color="blue"
                        disabled={currentPage === 1}
                        $active={currentPage !== 1}
                        onClick={() => onLoadNextPage(currentPage - 1)}
                    >
                        Previous
                    </PaginationLink>
                    {pageButtons}
                    <PaginationNextLink
                        to={`?page=${currentPage + 1}`}
                        color="blue"
                        disabled={currentPage === pageCount}
                    >
                        Next
                    </PaginationNextLink>
                </PaginationBox>
            )}
        </div>
    );
};
