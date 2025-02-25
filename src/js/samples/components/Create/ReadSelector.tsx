import { getBorder, getFontWeight, theme } from "@app/theme";
import {
    Box,
    BoxGroup,
    Button,
    Icon,
    InputError,
    InputSearch,
    Link,
    NoneFoundSection,
} from "@base";
import Toolbar from "@base/Toolbar";
import { CompactScrollList } from "@base/CompactScrollList";
import { useValidateFiles } from "@files/hooks";
import { FileResponse, FileType } from "@files/types";
import {
    FetchNextPageOptions,
    InfiniteData,
    InfiniteQueryObserverResult,
} from "@tanstack/react-query/";
import { flatMap, includes, indexOf, toLower } from "lodash-es";
import React, { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import ReadSelectorItem from "./ReadSelectorItem";

type ReadSelectorBoxProps = {
    error: string;
};

const ReadSelectorBox = styled(Box)<ReadSelectorBoxProps>`
    ${(props) => (props.error ? `border-color: ${theme.color.red};` : "")};
`;

const ReadSelectorError = styled(InputError)`
    margin-bottom: 10px;
`;

const ReadSelectorHeader = styled.label`
    align-items: center;
    display: flex;
    font-weight: ${getFontWeight("thick")};

    label {
        margin: 0;
    }

    span {
        color: grey;
        margin-left: auto;
    }
`;

const StyledScrollListElement = styled(CompactScrollList)`
    border: ${(props) => getBorder(props)};
    border-radius: ${(props) => props.theme.borderRadius.sm};
    height: 400px;
`;

type ReadSelectorProps = {
    /** Samples files on current page */
    data: InfiniteData<FileResponse>;
    /** Whether the next page is being fetched */
    isFetchingNextPage: boolean;
    /** Fetches the next page of data */
    fetchNextPage: (
        options?: FetchNextPageOptions,
    ) => Promise<InfiniteQueryObserverResult>;
    /** Whether the data is fetched */
    isPending: boolean;
    /** A callback function to handle file selection */
    onSelect: (selected: string[]) => void;
    /** Errors occurred on sample creation */
    error: string;
    /** The selected files */
    selected: string[];
};

/**
 * A list of read files with option to filter by file name
 */
export default function ReadSelector({
    data,
    isFetchingNextPage,
    fetchNextPage,
    isPending,
    onSelect,
    error,
    selected,
}: ReadSelectorProps) {
    useValidateFiles(FileType.reads, selected, onSelect);

    const [term, setTerm] = useState("");
    const [selectedFiles, setSelectedFiles] = useState(selected);

    const { total_count } = data.pages[0];

    function handleSelect(selectedId: string) {
        setSelectedFiles((prevArray) => {
            if (prevArray.includes(selectedId)) {
                const newArray = prevArray.filter((id) => id !== selectedId);
                onSelect(newArray);
                return newArray;
            } else {
                const newArray = [...prevArray, selectedId];
                if (newArray.length === 3) {
                    newArray.shift();
                }
                onSelect(newArray);
                return newArray;
            }
        });
    }

    useEffect(() => {
        setSelectedFiles(selected);
    }, [selected]);

    function swap() {
        onSelect(selected.slice().reverse());
    }

    function reset() {
        setTerm("");
        onSelect([]);
    }

    const loweredFilter = toLower(term);

    const items = flatMap(data.pages, (page) => page.items);
    const files = items.filter(
        (file) => !term || includes(toLower(file.name), loweredFilter),
    );

    function renderRow(item) {
        const index = indexOf(selectedFiles, item.id);

        return (
            <ReadSelectorItem
                {...item}
                key={item.id}
                index={index}
                selected={index > -1}
                onSelect={handleSelect}
            />
        );
    }

    const noneFound = total_count === 0 && (
        <BoxGroup>
            <NoneFoundSection noun="files">
                <Link to="/samples/files">Upload some</Link>
            </NoneFoundSection>
        </BoxGroup>
    );

    let pairedness: ReactNode | undefined;

    if (selected.length === 1) {
        pairedness = <span>Unpaired | </span>;
    }

    if (selected.length === 2) {
        pairedness = <span>Paired | </span>;
    }

    return (
        <div>
            <ReadSelectorHeader>
                <label>Read files</label>
                <span>
                    {pairedness}
                    {selected.length} of {total_count} selected
                </span>
            </ReadSelectorHeader>

            <ReadSelectorBox error={error}>
                <Toolbar>
                    <div className="flex-grow">
                        <InputSearch
                            placeholder="Filename"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </div>
                    <Button className="inline-flex gap-2" onClick={reset}>
                        <Icon name="undo" /> Reset
                    </Button>
                    <Button
                        className="inline-flex gap-2"
                        type="button"
                        onClick={swap}
                    >
                        <Icon name="retweet" /> Swap
                    </Button>
                </Toolbar>
                {noneFound || (
                    <>
                        <StyledScrollListElement
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            isPending={isPending}
                            items={files}
                            renderRow={renderRow}
                        />

                        <ReadSelectorError>{error}</ReadSelectorError>
                    </>
                )}
            </ReadSelectorBox>
        </div>
    );
}
