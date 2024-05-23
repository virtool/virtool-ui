import { BoxGroupSection } from "@base";
import React from "react";
import { useExpanded } from "../../hooks";
import { SequenceHeader } from "../Sequence/Header";
import SequenceButtons from "../Sequence/SequenceButtons";
import { SequenceAccessionValue, SequenceTitleValue } from "../Sequence/Values";
import { BarcodeSequenceTable } from "./Table";

export default function BarcodeSequence({ accession, definition, host, id, sequence, target }) {
    const { expanded, expand, collapse } = useExpanded();

    return (
        <BoxGroupSection onClick={expand}>
            <SequenceHeader>
                <SequenceAccessionValue accession={accession} />
                <SequenceTitleValue label="TARGET" value={target} />
                {expanded && <SequenceButtons id={id} onCollapse={collapse} />}
            </SequenceHeader>

            {expanded && (
                <BarcodeSequenceTable definition={definition} host={host} sequence={sequence} target={target} />
            )}
        </BoxGroupSection>
    );
}
