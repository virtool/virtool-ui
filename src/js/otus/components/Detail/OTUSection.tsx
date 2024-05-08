import React from "react";
import { match, useHistory, useLocation } from "react-router-dom";
import { LoadingPlaceholder } from "../../../base";
import { useGetReference } from "../../../references/queries";
import { CurrentOTUContextProvider, useFetchOTU } from "../../queries";
import AddIsolate from "./Isolates/AddIsolate";
import IsolateEditor from "./Isolates/IsolateEditor";
import General from "./OTUGeneral";

type OTUSectionProps = {
    /** Match object containing path information */
    match: match<{ otuId: string; refId: string }>;
};

/**
 * Displays a component for managing the OTU
 */
export default function OTUSection({ match }: OTUSectionProps) {
    const { otuId, refId } = match.params;

    const history = useHistory();
    const location = useLocation<{ addIsolate: boolean }>();
    const { data: reference, isLoading: isLoadingReference } = useGetReference(refId);
    const { data: otu, isLoading: isLoadingOTU } = useFetchOTU(otuId);

    if (isLoadingReference || isLoadingOTU) {
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
                onHide={() => history.replace({ state: { addIsolate: false } })}
            />
        </CurrentOTUContextProvider>
    );
}
