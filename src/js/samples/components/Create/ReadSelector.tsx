import { flatMap, includes, indexOf, toLower, without } from "lodash-es";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import { Box, Button, InputError, InputSearch, NoneFoundSection, Toolbar } from "../../../base";
import { ScrollList } from "../../../base/ScrollList";
import ReadSelectorItem from "./ReadSelectorItem";

const ReadSelectorBox = styled(Box)`
    ${props => (props.onError ? `border-color: ${props.theme.color.red};` : "")};
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

export default function ReadSelector(props) {
    const [term, setTerm] = useState("");

    function handleSelect(selectedId) {
        let selected;

        if (includes(props.selected, selectedId)) {
            alert("hi");
            selected = without(props.selected, selectedId);
        } else {
            selected = props.selected.concat([selectedId]);

            if (selected.length === 3) {
                selected.shift();
            }
        }
        alert(props.selected);

        props.onSelect(selected);
    }

    function swap() {
        props.onSelect(props.selected.slice().reverse());
    }

    function reset() {
        setTerm("");
        props.onSelect([]);
    }

    const loweredFilter = toLower(term);

    const items = flatMap(props.data.pages, page => page.items);
    const data = items.filter(file => !term || includes(toLower(file.name), loweredFilter));

    function renderRow(file) {
        const index = indexOf(props.selected, file.id);
        return <ReadSelectorItem {...file} key={file.id} index={index} selected={index > -1} onSelect={handleSelect} />;
    }

    const noneFound = props.data.pages[0].total_count === 0 && (
        <NoneFoundSection noun="data">
            <Link to="/samples/data">Upload some</Link>
        </NoneFoundSection>
    );

    let pairedness;

    if (props.selected.length == 1) {
        pairedness = <span>Unpaired | </span>;
    }

    if (props.selected.length == 2) {
        pairedness = <span>Paired | </span>;
    }

    return (
        <div>
            <ReadSelectorHeader>
                <label>Read data</label>
                <span>
                    {pairedness}
                    {props.selected.length} of {props.data.pages[0].total_count || 0} selected
                </span>
            </ReadSelectorHeader>

            <ReadSelectorBox onError={props.error}>
                <Toolbar>
                    <InputSearch placeholder="Filename" value={term} onChange={e => setTerm(e.target.value)} />
                    <ReadSelectorButton type="button" icon="undo" tip="Clear" onClick={reset} />
                    <ReadSelectorButton type="button" icon="retweet" tip="Swap Orientations" onClick={swap} />
                </Toolbar>
                {noneFound}

                <ScrollList
                    fetchNextPage={props.fetchNextPage}
                    isFetchingNextPage={props.isFetchingNextPage}
                    isLoading={props.isReadsLoading}
                    items={data}
                    renderRow={renderRow}
                />

                <ReadSelectorError>{props.error}</ReadSelectorError>
            </ReadSelectorBox>
        </div>
    );
}
