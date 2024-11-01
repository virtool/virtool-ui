import { useCurrentOTUContext } from "@otus/queries";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
import EditBarcodeSequence from "./Barcode/EditBarcodeSequence";
import EditGenomeSequence from "./Genome/EditGenomeSequence";

/**
 * A component to manage the editing of sequences
 */
export default function EditSequence() {
    const [activeIsolate] = useUrlSearchParam("activeIsolate");
    const { otu, reference } = useCurrentOTUContext();
    const { data_type } = reference;

    return data_type === "barcode" ? (
        <EditBarcodeSequence isolateId={activeIsolate} otuId={otu.id} />
    ) : (
        <EditGenomeSequence
            hasSchema={Boolean(otu.schema.length)}
            isolateId={activeIsolate}
            otuId={otu.id}
            refId={reference.id}
        />
    );
}
