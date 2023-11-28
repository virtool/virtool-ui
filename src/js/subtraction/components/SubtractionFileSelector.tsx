import { flatMap } from "lodash-es";
import React from "react";
import { InfiniteData } from "react-query";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BoxGroup, InputError, LoadingPlaceholder, NoneFoundBox } from "../../base";
import { ScrollList } from "../../base/ScrollList";
import { useInfiniteFindFiles } from "../../files/querys";
import { FileResponse, FileType } from "../../files/types";
import { useValidateFiles } from "../../utils/hooks";
import { SubtractionFileItem } from "./SubtractionFileItem";

const SubtractionFileSelectorError = styled(InputError)`
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
    const {
        data: subtractions,
        isLoading: isLoadingSubtractions,
        fetchNextPage: fetchNextSubtractionsPage,
        hasNextPage,
    } = useInfiniteFindFiles(FileType.subtraction, 25);

    useValidateFiles(subtractions, fetchNextSubtractionsPage, hasNextPage, isLoadingSubtractions, onClick, selected);

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
            <BoxGroup>
                <ScrollList
                    className={"maxHeight"}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    items={items}
                    renderRow={renderRow}
                />
            </BoxGroup>
            <SubtractionFileSelectorError>{error}</SubtractionFileSelectorError>
        </>
    );
}
