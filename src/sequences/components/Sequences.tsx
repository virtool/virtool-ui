import { getFontSize } from "@app/theme";
import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import NoneFoundSection from "@base/NoneFoundSection";
import { useCurrentOtuContext } from "@otus/queries";
import { OtuIsolate } from "@otus/types";
import sortSequencesBySegment from "@otus/utils";
import { map } from "lodash";
import React from "react";
import styled from "styled-components";
import CreateSequence from "./CreateSequence";
import CreateSequenceLink from "./CreateSequenceLink";
import RemoveSequence from "./RemoveSequence";
import Sequence from "./Sequence";
import SequenceEdit from "./SequenceEdit";

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
    activeIsolate: OtuIsolate;
    otuId: string;
};

/**
 * Display and manage a list sequences for a specific isolate
 */
export default function Sequences({
    activeIsolate,
    otuId,
}: IsolateSequencesProps) {
    const { otu, reference } = useCurrentOtuContext();

    const sequences = sortSequencesBySegment(
        activeIsolate.sequences,
        otu.schema,
    );

    let sequenceComponents = map(sequences, (sequence) => (
        <Sequence key={sequence.id} {...sequence} />
    ));

    let isolateName = `${activeIsolate.source_type} ${activeIsolate.source_name}`;
    isolateName = isolateName[0].toUpperCase() + isolateName.slice(1);

    if (!sequenceComponents.length) {
        sequenceComponents = [
            <NoneFoundSection noun="sequences" key="noSequences" />,
        ];
    }

    return (
        <>
            <IsolateSequencesHeader>
                <strong>Sequences</strong>
                <Badge>{sequences.length}</Badge>
                <CreateSequenceLink refId={reference.id} />
            </IsolateSequencesHeader>

            <BoxGroup>{sequenceComponents}</BoxGroup>

            <CreateSequence
                isolateId={activeIsolate.id}
                otuId={otuId}
                refId={reference.id}
                schema={otu.schema}
                sequences={sequences}
            />

            <SequenceEdit />
            <RemoveSequence
                isolateId={activeIsolate.id}
                isolateName={isolateName}
                otuId={otuId}
                sequences={sequences}
            />
        </>
    );
}
