import { filter, includes, indexOf, toLower, without } from "lodash-es";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import { Box, Button, InputError, InputSearch, NoneFoundSection, Pagination, Toolbar } from "../../../base";
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

// static propTypes = {
//     files: PropTypes.arrayOf(PropTypes.object),
//     error: PropTypes.string,
//     selected: PropTypes.arrayOf(PropTypes.number),
//     onSelect: PropTypes.func,
//     handleSelect: PropTypes.func,
// };

export default function ReadSelector(props) {
    const [term, setTerm] = useState("");
    const prevProps = useRef(props);

    // useEffect(() => {
    //     if (!isEqual(props.files, prevProps.current.files)) {
    //         props.onSelect(intersection(props.selected, map(props.files, "id")));
    //     }
    //     prevProps.current = props;
    // }, [props.files, props.selected, props.onSelect]);

    // componentDidUpdate(prevProps) {
    //     if (!isEqual(props.files, prevProps.files)) {
    //         prevProps.onSelect(intersection(prevProps.selected, map(props.files, "id")));
    //     }
    // }

    function handleSelect(selectedId) {
        let selected;

        if (includes(props.selected, selectedId)) {
            selected = without(props.selected, selectedId);
        } else {
            selected = props.selected.concat([selectedId]);

            if (selected.length === 3) {
                selected.shift();
            }
        }

        props.onSelect(selected);
    }

    function swap() {
        alert(JSON.stringify(props));
        props.onSelect(props.selected.slice().reverse());
    }

    function reset(e) {
        e.preventDefault();
        setTerm("");
        props.onSelect([]);
    }

    const loweredFilter = toLower(term);

    let files = filter(props.files.items, file => !term || includes(toLower(file.name), loweredFilter));

    function renderRow() {
        return function renderRowComponent(file) {
            const index = indexOf(props.selected, file.id);

            return (
                <ReadSelectorItem {...file} key={file.id} index={index} selected={index > -1} onSelect={handleSelect} />
            );
        };
    }
    // const renderRow = () => file => {
    //     const index = indexOf(props.selected, file.id);
    //
    //     return <ReadSelectorItem {...file} key={file.id} index={index} selected={index > -1} onSelect={handleSelect} />;
    // };

    if (!props.files.items.length) {
        files = (
            <NoneFoundSection noun="files">
                <Link to="/samples/files">Upload some</Link>
            </NoneFoundSection>
        );
    }

    let pairedness;

    if (props.selected.length == 1) {
        pairedness = <span>Unpaired | </span>;
    }

    if (props.selected.length == 2) {
        pairedness = <span>Paired | </span>;
    }

    const URLPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

    return (
        <div>
            <ReadSelectorHeader>
                <label>Read Files</label>
                <span>
                    {pairedness}
                    {props.selected.length} of {props.files.total_count || 0} selected
                </span>
            </ReadSelectorHeader>

            <ReadSelectorBox onError={props.error}>
                <Toolbar>
                    <InputSearch placeholder="Filename" value={term} onChange={e => setTerm(e.target.value)} />
                    <ReadSelectorButton type="button" icon="undo" tip="Clear" onClick={() => reset} />
                    <ReadSelectorButton type="button" icon="retweet" tip="Swap Orientations" onClick={swap} />
                </Toolbar>

                <Pagination
                    items={files}
                    renderRow={renderRow()}
                    storedPage={props.files.page}
                    currentPage={URLPage}
                    pageCount={props.files.page_count}
                />

                <ReadSelectorError>{props.error}</ReadSelectorError>
            </ReadSelectorBox>
        </div>
    );
}
