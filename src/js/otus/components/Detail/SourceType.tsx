import { capitalize, map } from "lodash-es";
import React from "react";
import { InputGroup, InputLabel, InputSimple } from "../../../base";

export function SourceType({ restrictSourceTypes, allowedSourceTypes, register, watch }) {
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
