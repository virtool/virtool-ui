import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight } from "../../../app/theme";
import {
    Box,
    InputError,
    InputGroup,
    InputLabel,
    Select,
    SelectButton,
    SelectContent,
    SelectItem,
} from "../../../base";
import { getHasSchema, getOTUDetailId } from "../../../otus/selectors";
import { getReferenceDetailId } from "../../../references/selectors";
import { getUnreferencedSegments } from "../../selectors";
import { SequenceSegment } from "./Segment";

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

export const SequenceSegmentField = ({ error, hasSchema, otuId, value, refId, segments, onChange }) => {
    if (hasSchema) {
        const segmentOptions = map(segments, segment => (
            <SequenceSegment name={segment.name} required={segment.required} />
        ));

        return (
            <InputGroup>
                <InputLabel>Segment</InputLabel>
                <SegmentSelectContainer>
                    <Select
                        value={value || "None"}
                        onValueChange={value => value != "" && onChange(value === "None" ? undefined : value)}
                    >
                        <SelectButton icon="chevron-down" />
                        <SelectContent position="popper" align="start">
                            <SelectItem value="None" text="None" description={undefined} />
                            {segmentOptions}
                        </SelectContent>
                    </Select>
                </SegmentSelectContainer>
                <InputError>{error}</InputError>
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
};

export const mapStateToProps = (state, ownProps) => ({
    hasSchema: getHasSchema(state),
    otuId: getOTUDetailId(state),
    refId: getReferenceDetailId(state),
    segments: getUnreferencedSegments(state),
});

export default connect(mapStateToProps)(SequenceSegmentField);
