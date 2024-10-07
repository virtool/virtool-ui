import { useCurrentOTUContext } from "@otus/queries";
import { useGetActiveSequence, useGetUnreferencedSegments, useGetUnreferencedTargets } from "@sequences/hooks";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import EditBarcodeSequence from "./Barcode/EditBarcodeSequence";
import EditGenomeSequence from "./Genome/EditGenomeSequence";

/**
 * A component to manage the editing of sequences
 */
export default function EditSequence() {
    const [activeIsolate] = useUrlSearchParams("activeIsolate");
    const { otu, reference } = useCurrentOTUContext();
    const { data_type } = reference;

    const targets = useGetUnreferencedTargets();
    const segments = useGetUnreferencedSegments();
    const activeSequence = useGetActiveSequence();

    return data_type === "barcode" ? (
        <EditBarcodeSequence
            activeSequence={activeSequence}
            isolateId={activeIsolate}
            otuId={otu.id}
            targets={targets}
        />
    ) : (
        <EditGenomeSequence
            activeSequence={activeSequence}
            hasSchema={Boolean(otu.schema.length)}
            isolateId={activeIsolate}
            otuId={otu.id}
            refId={reference.id}
            segments={segments}
        />
    );
}
