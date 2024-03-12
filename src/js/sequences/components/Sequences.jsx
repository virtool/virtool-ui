import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize } from "../../app/theme";
import { Badge, BoxGroup, NoneFoundSection } from "../../base";
import { getTargets } from "../../otus/selectors";
import { getDataType, getReferenceDetailId } from "../../references/selectors";
import { getSequences } from "../selectors";
import AddSequence from "./Add";
import AddSequenceLink from "./AddLink";
import BarcodeSequence from "./Barcode/Sequence";
import EditSequence from "./Edit";
import GenomeSequence from "./Genome/Sequence";
import RemoveSequence from "./RemoveSequence";

const IsolateSequencesHeader = styled.label`
    align-items: center;
    display: flex;
    font-weight: ${getFontSize("thick")};

    strong {
        font-size: ${getFontSize("lg")};
        padding-right: 5px;
    }
`;

export const IsolateSequences = ({ activeIsolate, dataType, sequences, hasTargets, referenceId, otuId }) => {
    const Sequence = dataType === "barcode" ? BarcodeSequence : GenomeSequence;

    let sequenceComponents = map(sequences, sequence => <Sequence key={sequence.id} {...sequence} />);

    if (!sequenceComponents.length) {
        if (dataType === "barcode" && !hasTargets) {
            sequenceComponents = (
                <NoneFoundSection noun="targets">
                    <Link to={`/refs/${referenceId}/manage`}>Create one</Link>
                </NoneFoundSection>
            );
        } else {
            sequenceComponents = <NoneFoundSection noun="sequences" />;
        }
    }

    return (
        <>
            <IsolateSequencesHeader>
                <strong>Sequences</strong>
                <Badge>{sequences.length}</Badge>
                <AddSequenceLink />
            </IsolateSequencesHeader>

            <BoxGroup>{sequenceComponents}</BoxGroup>

            <AddSequence />
            <EditSequence />
            <RemoveSequence isolateId={activeIsolate.id} isolateName={activeIsolate.name} otuId={otuId} />
        </>
    );
};

export const mapStateToProps = state => ({
    dataType: getDataType(state),
    sequences: getSequences(state),
    hasTargets: Boolean(getTargets(state)?.length),
    referenceId: getReferenceDetailId(state),
});

export default connect(mapStateToProps)(IsolateSequences);
