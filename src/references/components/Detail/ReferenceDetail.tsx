import { usePathParams } from "@app/hooks";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import IndexDetail from "@indexes/components/IndexDetail";
import Indexes from "@indexes/components/Indexes";
import OtuDetail from "@otus/components/Detail/OtuDetail";
import OtuList from "@otus/components/OtuList";
import { useFetchReference } from "@references/queries";
import React from "react";
import { Redirect, Route, Switch } from "wouter";
import EditReference from "./EditReference";
import ReferenceDetailHeader from "./ReferenceDetailHeader";
import ReferenceDetailTabs from "./ReferenceDetailTabs";
import ReferenceManager from "./ReferenceManager";
import ReferenceSettings from "./ReferenceSettings";

/**
 * The detailed view for a reference
 */
export default function ReferenceDetail() {
    const { refId } = usePathParams<{ refId: string }>();
    const { data, isPending, isError } = useFetchReference(refId);

    if (isError) {
        return <NotFound />;
    }

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <Switch>
                <Route path="/refs/:refId/otus/:otuId/*?" />
                <Route path="/refs/:refId/*?">
                    <ReferenceDetailHeader
                        createdAt={data.created_at}
                        isRemote={Boolean(data.remotes_from)}
                        name={data.name}
                        userHandle={data.user.handle}
                        refId={refId}
                    />
                    <ReferenceDetailTabs id={refId} otuCount={data.otu_count} />
                </Route>
            </Switch>

            <ContainerNarrow>
                <Switch>
                    <Route
                        path="/refs/:refId/"
                        component={() => (
                            <Redirect to={`/refs/${refId}/manage`} replace />
                        )}
                    />
                    <Route
                        path="/refs/:refId/manage"
                        component={ReferenceManager}
                    />
                    <Route
                        path="/refs/:refId/otus/:otuId/*?"
                        component={OtuDetail}
                    />
                    <Route path="/refs/:refId/otus" component={OtuList} />
                    <Route
                        path="/refs/:refId/indexes/:indexId"
                        component={IndexDetail}
                    />
                    <Route path="/refs/:refId/indexes" component={Indexes} />
                    <Route
                        path="/refs/:refId/settings"
                        component={ReferenceSettings}
                    />
                </Switch>
            </ContainerNarrow>

            <EditReference detail={data} />
        </>
    );
}
