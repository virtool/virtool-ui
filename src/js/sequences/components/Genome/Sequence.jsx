import React from "react";
import { BoxGroupSection } from "../../../base";
import { useExpanded } from "../../hooks";
import { SequenceHeader } from "../Sequence/Header";
import SequenceButtons from "../Sequence/SequenceButtons";
import { SequenceAccessionValue, SequenceTitleValue } from "../Sequence/Values";
import { GenomeSequenceTable } from "./Table";

export default function GenomeSequence({ accession, definition, host, id, segment, sequence }) {
    const { expanded, expand, collapse } = useExpanded();

    return (
        <BoxGroupSection onClick={expand}>
            <SequenceHeader>
                <SequenceAccessionValue accession={accession} />
                <SequenceTitleValue>
                    <p>{segment || definition}</p>
                    <small>{segment ? "SEGMENT" : "DEFINITION"}</small>
                </SequenceTitleValue>
                {expanded && <SequenceButtons id={id} onCollapse={collapse} />}
            </SequenceHeader>
            {expanded && (
                <GenomeSequenceTable definition={definition} host={host} segment={segment} sequence={sequence} />
            )}
        </BoxGroupSection>
    );
}
