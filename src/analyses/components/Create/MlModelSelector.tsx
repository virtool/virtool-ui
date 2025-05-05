import { map } from "lodash";
import React from "react";
import styled from "styled-components";
import Select from "../../../base/Select";
import SelectButton from "../../../base/SelectButton";
import SelectContent from "../../../base/SelectContent";
import SelectItem from "../../../base/SelectItem";
import { MLModelMinimal } from "../../../ml/types";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";

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
    models: MLModelMinimal[];
    onChange: (value: string) => void;
    selected: string;
};

export default function MlModelSelector({
    models,
    onChange,
    selected,
}: MLModelSelectorProps) {
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
