import { useDialogParam, usePathParams } from "@/hooks";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useGetReference } from "@references/queries";
import React from "react";
import { CurrentOtuContextProvider, useFetchOTU } from "../../queries";
import AddIsolate from "./Isolates/AddIsolate";
import IsolateEditor from "./Isolates/IsolateEditor";
import General from "./OTUGeneral";

/**
 * Displays a component for managing the OTU
 */
export default function OTUSection() {
    const { otuId, refId } = usePathParams<{ otuId: string; refId: string }>();
    const { open: openAddIsolate, setOpen: setOpenAddIsolate } =
        useDialogParam("openAddIsolate");

    const { data: reference, isPending: isPendingReference } =
        useGetReference(refId);
    const { data: otu, isPending: isPendingOTU } = useFetchOTU(otuId);

    if (isPendingReference || isPendingOTU) {
        return <LoadingPlaceholder />;
    }

    return (
        <CurrentOtuContextProvider otuId={otuId} refId={refId}>
            <General issues={otu.issues} isolates={otu.isolates} />
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
