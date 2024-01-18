import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight } from "../../../app/theme";
import { Box, InputGroup, InputLabel, Select, SelectButton, SelectContent, SelectItem } from "../../../base";
import { getHasSchema, getOTUDetailId } from "../../../otus/selectors";
import { OTUSegment } from "../../../otus/types";
import { getReferenceDetailId } from "../../../references/selectors";
import { getUnreferencedSegments } from "../../selectors";
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
    error: string;
    /** Whether a schema exists for the selected OTU */
    hasSchema: boolean;
    otuId: string;
    /** The selected segment */
    value: string;
    refId: string;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
    /** A callback function to handle segment selection */
    onChange: (value: string) => void;
};

/**
 * Displays a dropdown list of available segments in adding/editing dialogs or provides option to create schema
 */
export function SequenceSegmentField({
    hasSchema,
    otuId,
    value,
    refId,
    segments,
    onChange,
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

export function mapStateToProps(state) {
    return {
        hasSchema: getHasSchema(state),
        otuId: getOTUDetailId(state),
        refId: getReferenceDetailId(state),
        segments: getUnreferencedSegments(state),
    };
}

export default connect(mapStateToProps)(SequenceSegmentField);
