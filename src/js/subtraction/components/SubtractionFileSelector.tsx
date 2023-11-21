import { flatMap } from "lodash-es";
import React, { useEffect } from "react";
import { InfiniteData } from "react-query";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Attribution, BoxGroup, InputError, LoadingPlaceholder, NoneFoundBox, SelectBoxGroupSection } from "../../base";
import { ScrollList } from "../../base/ScrollList";
import { useInfiniteFindFiles } from "../../files/querys";
import { FileResponse, FileType } from "../../files/types";

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
    max-height: 400px;
    overflow-y: auto;
`;

function getAllSubtractions(fetchNextPage, hasNextPage, data) {
    if (hasNextPage) {
        void fetchNextPage();
    }
    return data.pages.flatMap(page => page.items);
}

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
    const {
        data: subtractions,
        isLoading: isLoadingSubtractions,
        fetchNextPage: fetchNextSubtractionsPage,
        hasNextPage,
    } = useInfiniteFindFiles(FileType.subtraction, 25);

    useEffect(() => {
        if (!isLoadingSubtractions && selected) {
            const allSubtractions = getAllSubtractions(fetchNextSubtractionsPage, hasNextPage, subtractions);

            if (!hasNextPage && !allSubtractions.some(item => item.id === selected)) {
                onClick("");
            }
        }
    }, [subtractions]);

    if (isLoadingSubtractions) {
        return <LoadingPlaceholder />;
    }

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

    return foundCount === 0 ? (
        <NoneFoundBox noun="files">
            <Link to="/subtractions/files">Upload some</Link>
        </NoneFoundBox>
    ) : (
        <>
            <SubtractionFileSelectorList id="subtraction-scroll">
                <ScrollList
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    items={items}
                    renderRow={renderRow}
                    elementId={"subtraction-scroll"}
                />
            </SubtractionFileSelectorList>
            <SubtractionFileSelectorError>{error}</SubtractionFileSelectorError>
        </>
    );
}
