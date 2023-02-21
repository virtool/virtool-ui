import { capitalize, map } from "lodash-es";
import React from "react";
import { Input, InputGroup, InputLabel, InputSelect } from "../../../base";

export const SourceType = ({ restrictSourceTypes, allowedSourceTypes, value, onChange }) => {
    if (restrictSourceTypes) {
        const optionComponents = map(allowedSourceTypes, sourceType => (
            <option key={sourceType} value={capitalize(sourceType)}>
                {capitalize(sourceType)}
            </option>
        ));

        return (
            <InputGroup>
                <InputLabel>Source Type</InputLabel>
                <InputSelect value={capitalize(value)} onChange={onChange}>
                    <option key="default" value="unknown">
                        Unknown
                    </option>
                    {optionComponents}
                </InputSelect>
            </InputGroup>
        );
    }

    return (
        <InputGroup>
            <InputLabel>Source type</InputLabel>
            <Input value={capitalize(value)} onChange={onChange} />
        </InputGroup>
    );
};
