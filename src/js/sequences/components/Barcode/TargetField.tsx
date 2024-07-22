import { fontWeight, getFontSize } from "@app/theme";
import { Icon, InputGroup, InputLabel, Select, SelectButton, SelectContent } from "@base";
import { ReferenceTarget } from "@references/types";
import { map } from "lodash-es";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
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
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
};

/**
 * Displays a dropdown list of available targets in adding/editing dialogs
 */
export default function TargetField({ targets }: TargetFieldProps) {
    const { control, setValue } = useFormContext();

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
                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        const targetExists = targets.some(target => target.name === value);

                        if (value && !targetExists) {
                            setValue("target", targets[0]?.name);
                        }

                        return (
                            <Select
                                disabled={disabled}
                                value={value}
                                onValueChange={value => value !== "" && onChange(value)}
                            >
                                <SelectButton icon="chevron-down" />
                                <SelectContent position="popper" align="start">
                                    {targetSelectOptions}
                                </SelectContent>
                            </Select>
                        );
                    }}
                    name="target"
                />
            </TargetSelectContainer>
        </InputGroup>
    );
}
