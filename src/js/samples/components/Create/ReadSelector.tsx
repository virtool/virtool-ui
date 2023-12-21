import { flatMap, includes, indexOf, toLower } from "lodash-es";
import React, { useEffect, useState } from "react";
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "react-query/types/core/types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getBorder, getFontWeight, theme } from "../../../app/theme";
import { Box, BoxGroup, Icon, InputError, InputSearch, NoneFoundSection, Toolbar } from "../../../base";
import { ScrollListElement } from "../../../base/ScrollList";
import { StyledButton } from "../../../base/styled/StyledButton";
import { useValidateFiles } from "../../../files/hooks";
import { FileResponse, FileType } from "../../../files/types";
import ReadSelectorItem from "./ReadSelectorItem";

type ReadSelectorBoxProps = {
    error: string;
};

const ReadSelectorBox = styled(Box)<ReadSelectorBoxProps>`
    ${props => (props.error ? `border-color: ${theme.color.red};` : "")};
`;

export const ReadSelectorButton = styled(StyledButton)`
    min-width: 44px;
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

const StyledScrollListElement = styled(ScrollListElement)`
    border: ${props => getBorder(props)};
    border-radius: ${props => props.theme.borderRadius.sm};
    overflow-y: auto;
    height: 400px;
`;

type ReadSelectorProps = {
    /** Samples files on current page */
    data: InfiniteData<FileResponse>;
    /** Whether the next page is being fetched */
    isFetchingNextPage: boolean;
    /** Fetches the next page of data */
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    /** Whether the data is loading */
    isLoading: boolean;
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
    isLoading,
    onSelect,
    error,
    selected,
}: ReadSelectorProps) {
    useValidateFiles(FileType.reads, selected, onSelect);

    const [term, setTerm] = useState("");
    const [selectedFiles, setSelectedFiles] = useState(selected);

    const { total_count } = data.pages[0];

    function handleSelect(selectedId: string) {
        setSelectedFiles(prevArray => {
            if (prevArray.includes(selectedId)) {
                const newArray = prevArray.filter(id => id !== selectedId);
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

    const items = flatMap(data.pages, page => page.items);
    const files = items.filter(file => !term || includes(toLower(file.name), loweredFilter));

    function renderRow(item) {
        const index = indexOf(selectedFiles, item.id);

        return <ReadSelectorItem {...item} key={item.id} index={index} selected={index > -1} onSelect={handleSelect} />;
    }

    const noneFound = total_count === 0 && (
        <BoxGroup>
            <NoneFoundSection noun="files">
                <Link to="/samples/files">Upload some</Link>
            </NoneFoundSection>
        </BoxGroup>
    );

    let pairedness;

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
                    <InputSearch placeholder="Filename" value={term} onChange={e => setTerm(e.target.value)} />
                    <ReadSelectorButton type="button" aria-label="undo" onClick={reset}>
                        <Icon name="undo" />
                    </ReadSelectorButton>
                    <ReadSelectorButton type="button" aria-label="retweet" onClick={swap}>
                        <Icon name="retweet" />
                    </ReadSelectorButton>
                </Toolbar>
                {noneFound || (
                    <>
                        <StyledScrollListElement
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            isLoading={isLoading}
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
