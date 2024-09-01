import { LoadingPlaceholder } from "@base";
import { useGetReference } from "@references/queries";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom-v5-compat";
import { CurrentOTUContextProvider, useFetchOTU } from "../../queries";
import AddIsolate from "./Isolates/AddIsolate";
import IsolateEditor from "./Isolates/IsolateEditor";
import General from "./OTUGeneral";

/**
 * Displays a component for managing the OTU
 */
export default function OTUSection() {
    const { otuId, refId } = useParams();

    const navigate = useNavigate();
    const location = useLocation();
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
                show={location.state?.addIsolate}
                onHide={() => navigate(".", { replace: true, state: { addIsolate: false } })}
            />
        </CurrentOTUContextProvider>
    );
}
