import { flatMap, includes, indexOf, toLower, without } from "lodash-es";
import React, { useState } from "react";
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "react-query/types/core/types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontWeight, theme } from "../../../app/theme";
import { Box, Button, InputError, InputSearch, NoneFoundSection, Toolbar } from "../../../base";
import { ScrollList } from "../../../base/ScrollList";
import { FileResponse } from "../../../files/types";
import ReadSelectorItem from "./ReadSelectorItem";

type ReadSelectorBoxProps = {
    error: string;
};

const ReadSelectorBox = styled(Box)<ReadSelectorBoxProps>`
    ${props => (props.error ? `border-color: ${theme.color.red};` : "")};
`;

export const ReadSelectorButton = styled(Button)`
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

type ReadSelectorProps = {
    data: InfiniteData<FileResponse>;
    isFetchingNextPage: boolean;
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    isLoading: boolean;
    onSelect: (selected: number[]) => void;
    error: string;
    selected: number[];
};

let selectedFiles = [];

export default function ReadSelector({
    data,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    onSelect,
    error,
    selected,
}: ReadSelectorProps) {
    const [term, setTerm] = useState("");

    selectedFiles = selected || [];

    function handleSelect(selectedId) {
        if (includes(selectedFiles, selectedId)) {
            selectedFiles = without(selectedFiles, selectedId);
        } else {
            selectedFiles = [...selectedFiles, selectedId];
            if (selectedFiles.length === 3) {
                selectedFiles.shift();
            }
        }
        onSelect(selectedFiles);
    }

    function swap() {
        onSelect(selected.slice().reverse());
    }

    function reset() {
        setTerm("");
        selectedFiles = [];
        onSelect([]);
    }

    const loweredFilter = toLower(term);

    const items = flatMap(data.pages, page => page.items);
    const files = items.filter(file => !term || includes(toLower(file.name), loweredFilter));

    function renderRow(item) {
        const index = indexOf(selected, item?.id);

        return (
            <ReadSelectorItem
                {...item}
                key={item?.id}
                index={index}
                selected={index > -1}
                selectedFiles={selectedFiles}
                onSelect={handleSelect}
            />
        );
    }

    const noneFound = data?.pages[0].total_count === 0 && (
        <NoneFoundSection noun="data">
            <Link to="/samples/data">Upload some</Link>
        </NoneFoundSection>
    );

    let pairedness;

    if (selected.length == 1) {
        pairedness = <span>Unpaired | </span>;
    }

    if (selected.length == 2) {
        pairedness = <span>Paired | </span>;
    }

    return (
        <div>
            <ReadSelectorHeader>
                <label>Read files</label>
                <span>
                    {pairedness}
                    {selected.length} of {data?.pages[0].total_count || 0} selected
                </span>
            </ReadSelectorHeader>

            <ReadSelectorBox error={error}>
                <Toolbar>
                    <InputSearch placeholder="Filename" value={term} onChange={e => setTerm(e.target.value)} />
                    <ReadSelectorButton type="button" icon="undo" tip="Clear" onClick={reset} />
                    <ReadSelectorButton type="button" icon="retweet" tip="Swap Orientations" onClick={swap} />
                </Toolbar>
                {noneFound}

                <ScrollList
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    items={files}
                    renderRow={renderRow}
                />

                <ReadSelectorError>{error}</ReadSelectorError>
            </ReadSelectorBox>
        </div>
    );
}
