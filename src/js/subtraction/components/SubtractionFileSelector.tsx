import { getBorder } from "@app/theme";
import { InputError, NoneFoundBox } from "@base";
import { ScrollList } from "@base/ScrollList";
import { useValidateFiles } from "@files/hooks";
import { File, FileResponse, FileType } from "@files/types";
import { InfiniteData } from "@tanstack/react-query";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "@tanstack/react-query/";
import { flatMap } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SubtractionFileItem } from "./SubtractionFileItem";

const SubtractionFileSelectorError = styled(InputError)`
    margin-bottom: 5px;
`;

const StyledScollList = styled(ScrollList)`
    border: ${props => getBorder(props)};
    border-radius: ${props => props.theme.borderRadius.sm};
`;

type SubtractionFileSelectorProps = {
    /** The subtraction files */
    files: InfiniteData<FileResponse>;
    /** The number of subtraction files */
    foundCount: number;
    /** The selected file id */
    selected: string[];
    /** A callback function to handle file selection */
    onClick: (selected: string[]) => void;
    /** Errors occurred on sample creation */
    error: string;
    /** Fetches the next page of data */
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    /** Whether there is another page of data available */
    hasNextPage: boolean;
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
    hasNextPage,
    isLoading,
    isFetchingNextPage,
}: SubtractionFileSelectorProps) {
    useValidateFiles(FileType.subtraction, selected, onClick);

    const items = flatMap(files.pages, page => page.items);

    function renderRow(item: File) {
        return (
            <SubtractionFileItem
                key={item.id}
                {...item}
                active={selected?.includes(item.id)}
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
            <StyledScollList
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                items={items}
                renderRow={renderRow}
            />
            <SubtractionFileSelectorError>{error}</SubtractionFileSelectorError>
        </>
    );
}
