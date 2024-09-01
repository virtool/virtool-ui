import { ContainerNarrow, LoadingPlaceholder, NotFound } from "@base";
import IndexDetail from "@indexes/components/IndexDetail";
import { useGetReference } from "@references/queries";
import React from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom-v5-compat";
import Indexes from "../../../indexes/components/Indexes";
import OTUDetail from "../../../otus/components/Detail/OTUDetail";
import OTUList from "../../../otus/components/OTUList";
import EditReference from "./EditReference";
import ReferenceDetailHeader from "./ReferenceDetailHeader";
import ReferenceDetailTabs from "./ReferenceDetailTabs";
import ReferenceManager from "./ReferenceManager";
import ReferenceSettings from "./ReferenceSettings";

/**
 * The detailed view for a reference
 */
export default function ReferenceDetail() {
    const { refId } = useParams();
    const { data, isPending, isError } = useGetReference(refId);

    if (isError) {
        return <NotFound />;
    }

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <Routes>
                <Route path="/otus/:otuId/*" />
                <Route
                    path="/*"
                    element={
                        <>
                            <ReferenceDetailHeader
                                createdAt={data.created_at}
                                isRemote={Boolean(data.remotes_from)}
                                name={data.name}
                                userHandle={data.user.handle}
                                refId={refId}
                            />
                            <ReferenceDetailTabs id={refId} otuCount={data.otu_count} />
                        </>
                    }
                />
            </Routes>

            <ContainerNarrow>
                <Routes>
                    <Route path="/" element={<Navigate replace to={`/refs/${refId}/manage`} />} />
                    <Route path="/manage" element={<ReferenceManager />} />
                    <Route path="/otus" element={<OTUList />} />
                    <Route path="/otus/:otuId/*" element={<OTUDetail />} />
                    <Route path="/indexes" element={<Indexes />} />
                    <Route path="/indexes/:indexId/*" element={<IndexDetail />} />
                    <Route path="/settings" element={<ReferenceSettings />} />
                </Routes>
            </ContainerNarrow>

            <EditReference detail={data} />
        </>
    );
}
