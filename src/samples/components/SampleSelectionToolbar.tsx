import { updateSearchParam } from "@app/hooks";
import Button from "@base/Button";
import Icon from "@base/Icon";
import LinkButton from "@base/LinkButton";
import React from "react";
import styled from "styled-components";
import { useSearch } from "wouter";

const SampleSelectionToolbarTop = styled.div`
    align-items: center;
    display: flex;
    margin-bottom: 15px;

    button {
        height: 38px;
    }

    button:first-child {
        align-items: center;
        display: flex;
        flex: 1;
        justify-content: flex-start;
        margin-right: 3px;
    }
`;

type SampleSelectionToolbarProps = {
    /** A callback function to clear selected samples */
    onClear: () => void;
    /** A list of selected samples */
    selected: string[];
};

/**
 * A toolbar allowing users to create an analysis for selected samples
 */
export default function SampleSelectionToolbar({
    onClear,
    selected,
}: SampleSelectionToolbarProps) {
    const search = useSearch();
    return (
        <SampleSelectionToolbarTop>
            <Button onClick={onClear}>
                Clear selection of {selected.length} samples
            </Button>
            <LinkButton
                color="green"
                to={updateSearchParam("openQuickAnalyze", "true", search)}
            >
                <Icon name="chart-area" /> Quick Analyze
            </LinkButton>
        </SampleSelectionToolbarTop>
    );
}
