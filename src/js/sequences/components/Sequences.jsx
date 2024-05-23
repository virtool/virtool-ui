import { getFontSize } from "@app/theme";
import { Badge, BoxGroup, NoneFoundSection } from "@base";
import { useCurrentOTUContext } from "@otus/queries";
import sortSequencesBySegment from "@otus/utils";
import RemoveSequence from "@sequences/components/RemoveSequence";
import { useGetUnreferencedTargets } from "@sequences/hooks";
import { map } from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AddSequenceLink from "./AddSequenceLink";
import AddBarcodeSequence from "./Barcode/AddBarcodeSequence";
import BarcodeSequence from "./Barcode/Sequence";
import EditSequence from "./EditSequence";
import AddGenomeSequence from "./Genome/AddGenomeSequence";
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

export default function IsolateSequences({ activeIsolate, otuId }) {
    const { otu, reference } = useCurrentOTUContext();
    const { data_type, id, targets } = reference;
    const unreferencedTargets = useGetUnreferencedTargets();
    const hasTargets = Boolean(targets?.length);

    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

    const Sequence = data_type === "barcode" ? BarcodeSequence : GenomeSequence;
    let sequenceComponents = map(sequences, sequence => <Sequence key={sequence.id} {...sequence} />);

    if (!sequenceComponents.length) {
        if (data_type === "barcode" && !hasTargets) {
            sequenceComponents = (
                <NoneFoundSection noun="targets">
                    <Link to={`/refs/${id}/manage`}>Create one</Link>
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
                <AddSequenceLink dataType={reference.data_type} refId={reference.id} />
            </IsolateSequencesHeader>

            <BoxGroup>{sequenceComponents}</BoxGroup>

            {data_type === "barcode" ? (
                <AddBarcodeSequence otuId={otuId} isolateId={activeIsolate.id} targets={unreferencedTargets} />
            ) : (
                <AddGenomeSequence
                    otuId={otuId}
                    isolateId={activeIsolate.id}
                    sequences={sequences}
                    schema={otu.schema}
                    refId={reference.id}
                />
            )}
            <EditSequence />
            <RemoveSequence
                isolateId={activeIsolate.id}
                isolateName={activeIsolate.name}
                otuId={otuId}
                sequences={sequences}
            />
        </>
    );
}
