import { getFontSize } from "@app/theme";
import { Badge, BoxGroup, NoneFoundSection } from "@base";
import { useCurrentOTUContext } from "@otus/queries";
import { OTUIsolate } from "@otus/types";
import sortSequencesBySegment from "@otus/utils";
import RemoveSequence from "@sequences/components/RemoveSequence";
import { useGetUnreferencedTargets } from "@sequences/hooks";
import { map } from "lodash";
import React from "react";
import { Link } from "react-router-dom-v5-compat";
import styled from "styled-components";
import AddSequenceLink from "./AddSequenceLink";
import AddBarcodeSequence from "./Barcode/AddBarcodeSequence";
import BarcodeSequence from "./Barcode/BarcodeSequence";
import EditSequence from "./EditSequence";
import AddGenomeSequence from "./Genome/AddGenomeSequence";
import GenomeSequence from "./Genome/GenomeSequence";

const IsolateSequencesHeader = styled.label`
    align-items: center;
    display: flex;
    font-weight: ${getFontSize("thick")};

    strong {
        font-size: ${getFontSize("lg")};
        padding-right: 5px;
    }
`;

type IsolateSequencesProps = {
    /** The Isolate that is currently selected */
    activeIsolate: OTUIsolate;
    otuId: string;
};

/**
 * Display and manage a list sequences for a specific isolate
 */
export default function IsolateSequences({ activeIsolate, otuId }: IsolateSequencesProps) {
    const { otu, reference } = useCurrentOTUContext();
    const { data_type, id, targets } = reference;
    const unreferencedTargets = useGetUnreferencedTargets();
    const hasTargets = Boolean(targets?.length);

    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

    const Sequence = data_type === "barcode" ? BarcodeSequence : GenomeSequence;
    let sequenceComponents = map(sequences, sequence => <Sequence key={sequence.id} {...sequence} />);

    let isolateName = `${activeIsolate.source_type} ${activeIsolate.source_name}`;
    isolateName = isolateName[0].toUpperCase() + isolateName.slice(1);

    if (!sequenceComponents.length) {
        if (data_type === "barcode" && !hasTargets) {
            sequenceComponents = [
                <NoneFoundSection noun="targets" key="noTargets">
                    <Link to={`/refs/${id}/manage`}>Create one</Link>
                </NoneFoundSection>,
            ];
        } else {
            sequenceComponents = [<NoneFoundSection noun="sequences" key="noSequences" />];
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
                    isolateId={activeIsolate.id}
                    otuId={otuId}
                    refId={reference.id}
                    schema={otu.schema}
                    sequences={sequences}
                />
            )}
            <EditSequence />
            <RemoveSequence
                isolateId={activeIsolate.id}
                isolateName={isolateName}
                otuId={otuId}
                sequences={sequences}
            />
        </>
    );
}
