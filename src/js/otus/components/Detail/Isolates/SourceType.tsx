import { capitalize, map } from "lodash-es";
import React from "react";
import { Control, Controller, UseFormRegister, UseFormWatch } from "react-hook-form";
import { InputGroup, InputLabel, InputSimple } from "../../../../base";

type IsolateFormValues = {
    sourceName: string;
    sourceType: string;
};

type SourceTypeProps = {
    allowedSourceTypes: string[];
    register: UseFormRegister<IsolateFormValues>;
    restrictSourceTypes: boolean;
    watch: UseFormWatch<IsolateFormValues>;
    control: Control<IsolateFormValues>;
};

/**
 * Displays input for source type in isolate creation dialog
 */
export function SourceType({ allowedSourceTypes, control, register, restrictSourceTypes, watch }: SourceTypeProps) {
    if (restrictSourceTypes) {
        const optionComponents = map(allowedSourceTypes, sourceType => (
            <option key={sourceType} value={capitalize(sourceType)}>
                {capitalize(sourceType)}
            </option>
        ));

        return (
            <InputGroup>
                <InputLabel htmlFor="sourceType">Source Type</InputLabel>
                <Controller
                    name="sourceType"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <InputSimple
                            as="select"
                            id="sourceType"
                            {...register("sourceType")}
                            value={value}
                            onChange={onChange}
                        >
                            <option key="default" value="unknown">
                                Unknown
                            </option>
                            {optionComponents}
                        </InputSimple>
                    )}
                />
            </InputGroup>
        );
    }

    return (
        <InputGroup>
            <InputLabel htmlFor="sourceType">Source Type</InputLabel>
            <InputSimple id="sourceType" {...register("sourceType")} value={capitalize(watch("sourceType"))} />
        </InputGroup>
    );
}
