import { LocationType } from "@/types/types";
import { useCurrentOTUContext } from "@otus/queries";
import { useGetActiveSequence, useGetUnreferencedSegments, useGetUnreferencedTargets } from "@sequences/hooks";
import React from "react";
import { useLocation } from "react-router-dom";
import EditBarcodeSequence from "./Barcode/EditBarcodeSequence";
import EditGenomeSequence from "./Genome/EditGenomeSequence";

/**
 * A component to manage the editing of sequences
 */
export default function EditSequence() {
    const location = useLocation<LocationType>();
    const { otu, reference } = useCurrentOTUContext();
    const { data_type } = reference;

    const isolateId = location.state?.activeIsolateId || otu.isolates[0]?.id;
    const targets = useGetUnreferencedTargets();
    const segments = useGetUnreferencedSegments();
    const activeSequence = useGetActiveSequence();

    return data_type === "barcode" ? (
        <EditBarcodeSequence activeSequence={activeSequence} otuId={otu.id} targets={targets} isolateId={isolateId} />
    ) : (
        <EditGenomeSequence
            activeSequence={activeSequence}
            otuId={otu.id}
            isolateId={isolateId}
            segments={segments}
            hasSchema={Boolean(otu.schema.length)}
            refId={reference.id}
        />
    );
}
