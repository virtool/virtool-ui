import { map } from "lodash";
import React from "react";
import styled from "styled-components";
import { Select, SelectButton, SelectContent, SelectItem } from "../../../base";
import { MLModel } from "../../../ml/types";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";

const MLModelSelectButton = styled(SelectButton)`
    display: flex;
    width: 100%;

    button {
        flex-grow: 1;
    }
`;

const StyledMLModelSelector = styled.div`
    margin-bottom: 30px;
`;

export type MLModelSelectorProps = {
    models: Array<MLModel>;
    selected: string;
    onChange: (value: string) => void;
};

export function MLModelSelector({ models, selected, onChange }) {
    const mlModelItems = map(
        models,
        ({ latest_release, name, description }) => (
            <SelectItem
                value={latest_release.id.toString()}
                key={latest_release.id}
                description={description}
            >
                {name}
            </SelectItem>
        ),
    );

    return (
        <StyledMLModelSelector>
            <CreateAnalysisFieldTitle>MLModel</CreateAnalysisFieldTitle>
            <Select value={selected} onValueChange={onChange}>
                <MLModelSelectButton
                    placeholder="Select a model"
                    icon="chevron-down"
                />
                <SelectContent position="popper" align="start">
                    {mlModelItems}
                </SelectContent>
            </Select>
        </StyledMLModelSelector>
    );
}
