import { fontWeight } from "@app/theme";
import { Box, InputGroup, InputLabel, Link, Select, SelectButton, SelectContent, SelectItem } from "@base";
import { OTUSegment } from "@otus/types";
import { map } from "lodash-es";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { SequenceSegment } from "./SequenceSegment";

const SegmentSelectContainer = styled.div`
    display: flex;
    flex-direction: column;

    button {
        flex-grow: 1;
        padding: 10px 10px;
    }
`;

const NoSchema = styled(Box)`
    align-items: center;
    display: flex;
    justify-content: space-between;

    a,
    h5 {
        font-weight: ${fontWeight.thick};
    }

    h5 {
        margin: 0 0 5px;
    }

    p {
        margin: 0;
    }
`;

type SequenceSegmentFieldProps = {
    /** Whether a schema exists for the selected OTU */
    hasSchema: boolean;
    otuId: string;
    refId: string;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
};

/**
 * Displays a dropdown list of available segments in adding/editing dialogs or provides option to create schema
 */
export default function SequenceSegmentField({ hasSchema, otuId, refId, segments }: SequenceSegmentFieldProps) {
    const { control, setValue } = useFormContext<{ segment: string }>();

    if (hasSchema) {
        const segmentOptions = map(segments, segment => (
            <SequenceSegment key={segment.name} name={segment.name} required={segment.required} />
        ));

        return (
            <InputGroup>
                <InputLabel htmlFor="segment">Segment</InputLabel>
                <SegmentSelectContainer>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => {
                            const segmentExists = segments.some(segment => segment.name === value);

                            if (value && !segmentExists) {
                                setValue("segment", null);
                            }

                            return (
                                <Select
                                    value={value || "None"}
                                    onValueChange={value => value !== "" && onChange(value === "None" ? null : value)}
                                >
                                    <SelectButton icon="chevron-down" />
                                    <SelectContent position="popper" align="start">
                                        <SelectItem key="None" value="None" description="">
                                            None
                                        </SelectItem>
                                        {segmentOptions}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                        name="segment"
                    />
                </SegmentSelectContainer>
            </InputGroup>
        );
    }

    return (
        <InputGroup>
            <InputLabel>Segment</InputLabel>
            <NoSchema>
                <div>
                    <h5>No schema is defined for this OTU.</h5>
                    <p>A schema defines the sequence segments that should be present in isolates of the OTU. </p>
                </div>
                <div>
                    <Link to={`/refs/${refId}/otus/${otuId}/schema`}>Add a Schema</Link>
                </div>
            </NoSchema>
        </InputGroup>
    );
}
