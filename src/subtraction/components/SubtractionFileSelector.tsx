import { InfiniteData } from "@tanstack/react-query";
import {
    FetchNextPageOptions,
    InfiniteQueryObserverResult,
} from "@tanstack/react-query/";
import { flatMap } from "lodash-es";
import React from "react";
import styled from "styled-components";
import CompactScrollList from "../../base/CompactScrollList";
import InputError from "../../base/InputError";
import Link from "../../base/Link";
import NoneFoundBox from "../../base/NoneFoundBox";
import { useValidateFiles } from "../../files/hooks";
import { File, FileResponse, FileType } from "../../files/types";
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
    selected: string[];

    /** A callback function to handle file selection */
    onClick: (selected: string[]) => void;

    /** Errors occurred on sample creation */
    error: string;

    /** Fetches the next page of data */
    fetchNextPage: (
        options?: FetchNextPageOptions,
    ) => Promise<InfiniteQueryObserverResult>;

    /** Whether the data is fetched */
    isPending: boolean;

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
    isPending,
    isFetchingNextPage,
}: SubtractionFileSelectorProps) {
    useValidateFiles(FileType.subtraction, selected, onClick);

    const items = flatMap(files.pages, (page) => page.items);

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
            <CompactScrollList
                className="max-h-96"
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isPending={isPending}
                items={items}
                renderRow={renderRow}
            />
            <SubtractionFileSelectorError>{error}</SubtractionFileSelectorError>
        </>
    );
}
