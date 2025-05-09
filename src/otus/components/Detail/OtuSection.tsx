import { useDialogParam, usePathParams } from "@app/hooks";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { CurrentOtuContextProvider, useFetchOTU } from "@otus/queries";
import { useFetchReference } from "@references/queries";
import React from "react";
import OtuIssues from "../OtuIssues";
import AddIsolate from "./Isolates/AddIsolate";
import IsolateEditor from "./Isolates/IsolateEditor";

/**
 * Displays a component for managing the OTU
 */
export default function OtuSection() {
    const { otuId, refId } = usePathParams<{ otuId: string; refId: string }>();
    const { open: openAddIsolate, setOpen: setOpenAddIsolate } =
        useDialogParam("openAddIsolate");

    const { data: reference, isPending: isPendingReference } =
        useFetchReference(refId);
    const { data: otu, isPending: isPendingOTU } = useFetchOTU(otuId);

    if (isPendingReference || isPendingOTU) {
        return <LoadingPlaceholder />;
    }

    return (
        <CurrentOtuContextProvider otuId={otuId} refId={refId}>
            {otu.issues && (
                <OtuIssues issues={otu.issues} isolates={otu.isolates} />
            )}
            <IsolateEditor />
            <AddIsolate
                allowedSourceTypes={reference.source_types}
                otuId={otuId}
                restrictSourceTypes={reference.restrict_source_types}
                show={openAddIsolate}
                onHide={() => setOpenAddIsolate(false)}
            />
        </CurrentOtuContextProvider>
    );
}
