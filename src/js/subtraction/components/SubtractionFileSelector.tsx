import { flatMap } from "lodash-es";
import React, { useEffect } from "react";
import { InfiniteData } from "react-query";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Attribution, BoxGroup, InputError, NoneFoundBox, SelectBoxGroupSection } from "../../base";
import { ScrollList } from "../../base/ScrollList";
import { FileResponse } from "../../files/types";

type StyledSubtractionFileItemProps = {
    error: string;
};

const StyledSubtractionFileItem = styled(SelectBoxGroupSection)<StyledSubtractionFileItemProps>`
    display: flex;

    ${Attribution} {
        margin-left: auto;
    }
`;

export function SubtractionFileItem({ active, onClick, name, uploaded_at, user, id, error }) {
    function handleClick() {
        onClick(id);
    }

    return (
        <StyledSubtractionFileItem active={active} onClick={handleClick} error={error}>
            <strong>{name}</strong>
            <Attribution user={user.handle} time={uploaded_at} />
        </StyledSubtractionFileItem>
    );
}

const SubtractionFileSelectorError = styled(InputError)`
    margin-bottom: 5px;
`;

const SubtractionFileSelectorList = styled(BoxGroup)`
    margin-bottom: 5px;
`;

type SubtractionFileSelectorProps = {
    /** The subtraction files */
    files: InfiniteData<FileResponse>;
    /** The number of subtraction files */
    foundCount: number;
    /** The selected file id */
    selected: string;
    /** A callback function to handle file selection */
    onClick: (selected: string) => void;
    /** Errors occurred on sample creation */
    error: string;
    /** Fetches the next page of data */
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    /** Whether the data is loading */
    isLoading: boolean;
    /** Whether the next page is being fetched */
    isFetchingNextPage: boolean;
};

/**
 * A list of subtraction files
 */
export function SubtractionFileSelector({
    files,
    foundCount,
    selected,
    onClick,
    error,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
}: SubtractionFileSelectorProps) {
    const items = flatMap(files.pages, page => page.items);

    function renderRow(item) {
        return (
            <SubtractionFileItem
                key={item.id}
                {...item}
                active={item.id === selected}
                onClick={onClick}
                error={error}
            />
        );
    }

    useEffect(() => {
        if (selected) {
            onClick("");
        }
    }, [foundCount]);

    return foundCount === 0 ? (
        <NoneFoundBox noun="files">
            <Link to="/subtractions/files">Upload some</Link>
        </NoneFoundBox>
    ) : (
        <>
            <SubtractionFileSelectorList>
                <ScrollList
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    items={items}
                    renderRow={renderRow}
                />
            </SubtractionFileSelectorList>
            <SubtractionFileSelectorError>{error}</SubtractionFileSelectorError>
        </>
    );
}
