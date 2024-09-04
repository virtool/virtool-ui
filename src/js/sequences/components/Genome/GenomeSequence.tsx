import { BoxGroupSection } from "@base";
import React from "react";
import { useExpanded } from "../../hooks";
import SequenceButtons from "../Sequence/SequenceButtons";
import { SequenceHeader } from "../Sequence/SequenceHeader";
import { SequenceAccessionValue, SequenceTitleValue } from "../Sequence/SequenceValues";
import GenomeSequenceTable from "./GenomeSequenceTable";

type GenomeSequenceProps = {
    accession: string;
    definition: string;
    host: string;
    id: string;
    segment?: string;
    sequence: string;
};

/**
 * A condensed genome sequence item for use in a list of sequences
 */
export default function GenomeSequence({ accession, definition, host, id, segment, sequence }: GenomeSequenceProps) {
    const { expanded, expand, collapse } = useExpanded();

    return (
        <BoxGroupSection onClick={expand}>
            <SequenceHeader>
                <SequenceAccessionValue accession={accession} />
                <SequenceTitleValue label={segment ? "SEGMENT" : "DEFINITION"} value={segment || definition} />
                {expanded && <SequenceButtons id={id} onCollapse={collapse} />}
            </SequenceHeader>
            {expanded && (
                <GenomeSequenceTable definition={definition} host={host} segment={segment} sequence={sequence} />
            )}
        </BoxGroupSection>
    );
}
