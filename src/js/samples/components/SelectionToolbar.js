import React from "react";
import styled from "styled-components";
import { Button } from "../../base";

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

export const SampleSelectionToolbar = ({ onClear, onQuickAnalyze, selected }) => (
    <SampleSelectionToolbarTop>
        <Button icon="times-circle" onClick={onClear}>
            Clear selection of {selected.length} samples
        </Button>
        <Button color="green" icon="chart-area" onClick={() => onQuickAnalyze(selected)}>
            Quick Analyze
        </Button>
    </SampleSelectionToolbarTop>
);
