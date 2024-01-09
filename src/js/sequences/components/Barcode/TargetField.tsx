import { find, map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { fontWeight, getFontSize } from "../../../app/theme";
import { Icon, InputGroup, InputLabel, ListboxInput, Select, SelectButton, SelectContent } from "../../../base";
import { getTargets } from "../../../otus/selectors";
import { ReferenceTarget } from "../../../references/types";
import { getUnreferencedTargets } from "../../selectors";
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

const TargetFieldListboxInput = styled(ListboxInput)`
    > [data-reach-listbox-button][aria-disabled="true"] {
        opacity: 1;
        color: ${props => props.theme.color.black};
        cursor: default;
    }
`;

type TargetFieldProps = {
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
    /** The data associated to the selected target */
    targetValue: ReferenceTarget;
    /** A callback function to handle target selection */
    onChange: (value: string) => void;
};

/**
 * Displays a dropdown list of available targets in adding/editing dialogs
 */
export function TargetField({ targets, targetValue, onChange }: TargetFieldProps) {
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
                <Select defaultValue={targetValue.name} onValueChange={onChange}>
                    <SelectButton icon="chevron-down" />
                    <SelectContent position="popper" align="start">
                        {targetSelectOptions}
                    </SelectContent>
                </Select>
            </TargetSelectContainer>
        </InputGroup>
    );
}

export const mapStateToProps = (state, props) => ({
    targets: getUnreferencedTargets(state),
    targetValue: find(getTargets(state), { name: props.value }),
});

export default connect(mapStateToProps)(TargetField);
