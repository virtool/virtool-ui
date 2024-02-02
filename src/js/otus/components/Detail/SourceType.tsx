import { capitalize, map } from "lodash-es";
import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { InputGroup, InputLabel, InputSimple } from "../../../base";

type IsolateFormValues = {
    sourceName: string;
    sourceType: string;
};

type SourceTypeProps = {
    allowedSourceTypes: string[];
    register: UseFormRegister<IsolateFormValues>;
    restrictSourceTypes: boolean;
    watch: UseFormWatch<IsolateFormValues>;
};

/**
 * Displays input for source type in isolate creation dialog
 */
export function SourceType({ allowedSourceTypes, register, restrictSourceTypes, watch }: SourceTypeProps) {
    if (restrictSourceTypes) {
        const optionComponents = map(allowedSourceTypes, sourceType => (
            <option key={sourceType} value={capitalize(sourceType)}>
                {capitalize(sourceType)}
            </option>
        ));

        return (
            <InputGroup>
                <InputLabel>Source Type</InputLabel>
                <InputSimple as="select" id="sourceType" {...register("sourceType")}>
                    <option key="default" value="unknown">
                        Unknown
                    </option>
                    {optionComponents}
                </InputSimple>
            </InputGroup>
        );
    }

    return (
        <InputGroup>
            <InputLabel htmlFor="sourceType">Source type</InputLabel>
            <InputSimple id="sourceType" {...register("sourceType")} value={capitalize(watch("sourceType"))} />
        </InputGroup>
    );
}
