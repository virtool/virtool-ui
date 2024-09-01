import { useCurrentOTUContext } from "@otus/queries";
import { useGetActiveSequence, useGetUnreferencedSegments, useGetUnreferencedTargets } from "@sequences/hooks";
import React from "react";
import { useLocation } from "react-router-dom-v5-compat";
import EditBarcodeSequence from "./Barcode/EditBarcodeSequence";
import EditGenomeSequence from "./Genome/EditGenomeSequence";

/**
 * A component to manage the editing of sequences
 */
export default function EditSequence() {
    const location = useLocation();
    const { otu, reference } = useCurrentOTUContext();
    const { data_type } = reference;

    const isolateId = location.state?.activeIsolateId || otu.isolates[0]?.id;
    const targets = useGetUnreferencedTargets();
    const segments = useGetUnreferencedSegments();
    const activeSequence = useGetActiveSequence();

    return data_type === "barcode" ? (
        <EditBarcodeSequence activeSequence={activeSequence} isolateId={isolateId} otuId={otu.id} targets={targets} />
    ) : (
        <EditGenomeSequence
            activeSequence={activeSequence}
            hasSchema={Boolean(otu.schema.length)}
            isolateId={isolateId}
            otuId={otu.id}
            refId={reference.id}
            segments={segments}
        />
    );
}
