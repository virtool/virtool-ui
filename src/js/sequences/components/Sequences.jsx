import { getFontSize } from "@app/theme";
import { Badge, BoxGroup, NoneFoundSection } from "@base";
import { useCurrentOTUContext } from "@otus/queries";
import { getTargets } from "@otus/selectors";
import sortSequencesBySegment from "@otus/utils";
import { getDataType, getReferenceDetailId } from "@references/selectors";
import RemoveSequence from "@sequences/components/RemoveSequence";
import { map } from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AddSequence from "./Add";
import AddSequenceLink from "./AddLink";
import BarcodeSequence from "./Barcode/Sequence";
import EditSequence from "./Edit";
import GenomeSequence from "./Genome/Sequence";

const IsolateSequencesHeader = styled.label`
    align-items: center;
    display: flex;
    font-weight: ${getFontSize("thick")};

    strong {
        font-size: ${getFontSize("lg")};
        padding-right: 5px;
    }
`;

export const IsolateSequences = ({ activeIsolate, dataType, hasTargets, referenceId, otuId }) => {
    const { otu } = useCurrentOTUContext();
    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

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
            <RemoveSequence
                isolateId={activeIsolate.id}
                isolateName={activeIsolate.name}
                otuId={otuId}
                sequences={sequences}
            />
        </>
    );
};

export const mapStateToProps = state => ({
    dataType: getDataType(state),
    hasTargets: Boolean(getTargets(state)?.length),
    referenceId: getReferenceDetailId(state),
});

export default connect(mapStateToProps)(IsolateSequences);
