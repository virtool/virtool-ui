import { fontWeight, getFontSize } from "@app/theme";
import { Icon, InputGroup, InputLabel, Select, SelectButton, SelectContent } from "@base";
import { ReferenceTarget } from "@references/types";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { SequenceTarget } from "./SequenceTarget";

const TargetSelectContainer = styled.div`
    display: flex;
    flex-direction: column;

    button {
        flex-grow: 1;
        padding: 10px 10px;
    }
`;

const TargetFieldLabel = styled(InputLabel)`
    align-items: center;
    display: flex;
`;

const TargetFieldLabelLock = styled.span`
    color: ${props => props.theme.color.grey};
    font-weight: ${fontWeight.thick};
    font-size: ${getFontSize("sm")};
    margin-left: auto;

    span {
        margin-left: 5px;
    }
`;

type TargetFieldProps = {
    /** A callback function to handle target selection */
    onChange: (value: string) => void;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
    /** The selected target */
    value: string;
};

/**
 * Displays a dropdown list of available targets in adding/editing dialogs
 */
export default function TargetField({ onChange, targets, value }: TargetFieldProps) {
    const targetSelectOptions = map(targets, target => (
        <SequenceTarget key={target.name} name={target.name} description={target.description} />
    ));

    const disabled = targets.length === 0;

    return (
        <InputGroup>
            <TargetFieldLabel>
                <span>Target</span>
                {disabled && (
                    <TargetFieldLabelLock>
                        <Icon name="lock" />
                        <span>All targets in use</span>
                    </TargetFieldLabelLock>
                )}
            </TargetFieldLabel>
            <TargetSelectContainer>
                <Select disabled={disabled} value={value} onValueChange={value => value !== "" && onChange(value)}>
                    <SelectButton icon="chevron-down" />
                    <SelectContent position="popper" align="start">
                        {targetSelectOptions}
                    </SelectContent>
                </Select>
            </TargetSelectContainer>
        </InputGroup>
    );
}
