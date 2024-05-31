import { map } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight } from "../../../app/theme";
import { Box, InputGroup, InputLabel, Select, SelectButton, SelectContent, SelectItem } from "../../../base";
import { OTUSegment } from "../../../otus/types";
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
    /** A callback function to handle segment selection */
    onChange: (value: string) => void;
    otuId: string;
    refId: string;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
    /** The selected segment */
    value: string;
};

/**
 * Displays a dropdown list of available segments in adding/editing dialogs or provides option to create schema
 */
export default function SequenceSegmentField({
    hasSchema,
    onChange,
    otuId,
    refId,
    segments,
    value,
}: SequenceSegmentFieldProps) {
    if (hasSchema) {
        const segmentOptions = map(segments, segment => (
            <SequenceSegment key={segment.name} name={segment.name} required={segment.required} />
        ));

        return (
            <InputGroup>
                <InputLabel>Segment</InputLabel>
                <SegmentSelectContainer>
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
