import LoadingPlaceholder from "@base/LoadingPlaceholder";
import React from "react";
import { useDialogParam, usePathParams } from "../../../app/hooks";
import { useGetReference } from "../../../references/queries";
import { CurrentOtuContextProvider, useFetchOTU } from "../../queries";
import AddIsolate from "./Isolates/AddIsolate";
import IsolateEditor from "./Isolates/IsolateEditor";
import OtuIssues from "./OtuIssues";

/**
 * Displays a component for managing the OTU
 */
export default function OtuSection() {
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
