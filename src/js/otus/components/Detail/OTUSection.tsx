import { LoadingPlaceholder } from "@base";
import { useGetReference } from "@references/queries";
import { useSearchParams, useUrlSearchParam } from "@utils/hooks";
import React from "react";
import { CurrentOTUContextProvider, useFetchOTU } from "../../queries";
import AddIsolate from "./Isolates/AddIsolate";
import IsolateEditor from "./Isolates/IsolateEditor";
import General from "./OTUGeneral";

/**
 * Displays a component for managing the OTU
 */
export default function OTUSection() {
    const { otuId, refId } = useSearchParams<{ otuId: string; refId: string }>();
    const [openAddIsolate, setOpenAddIsolate] = useUrlSearchParam("openAddIsolate");

    const { data: reference, isPending: isPendingReference } = useGetReference(refId);
    const { data: otu, isPending: isPendingOTU } = useFetchOTU(otuId);

    if (isPendingReference || isPendingOTU) {
        return <LoadingPlaceholder />;
    }

    return (
        <CurrentOTUContextProvider otuId={otuId} refId={refId}>
            <General issues={otu.issues} isolates={otu.isolates} />
            <IsolateEditor />
            <AddIsolate
                allowedSourceTypes={reference.source_types}
                otuId={otuId}
                restrictSourceTypes={reference.restrict_source_types}
                show={Boolean(openAddIsolate)}
                onHide={() => setOpenAddIsolate("")}
            />
        </CurrentOTUContextProvider>
    );
}
