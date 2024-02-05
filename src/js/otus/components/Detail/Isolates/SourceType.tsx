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
    /** Function to register form fields */
    register: UseFormRegister<IsolateFormValues>;
    /** Indicates whether the source types are restricted */
    restrictSourceTypes: boolean;
    /** Watches for changes in form values */
    watch: UseFormWatch<IsolateFormValues>;
    /** Controls the state of a form */
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
