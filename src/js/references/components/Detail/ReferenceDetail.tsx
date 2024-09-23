import { ContainerNarrow, LoadingPlaceholder, NotFound } from "@base";
import IndexDetail from "@indexes/components/IndexDetail";
import { useGetReference } from "@references/queries";
import React from "react";
import { Redirect, Route, Switch, useParams } from "wouter";
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
    const { refId } = useParams<{ refId: string }>();
    const { data, isPending, isError } = useGetReference(refId);

    if (isError) {
        return <NotFound />;
    }

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <Switch>
                <Route path="/otus/:otuId/*" />
                <Route path="">
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
                    <Route path="/" component={() => <Redirect to={`/manage`} replace />} />
                    <Route path="manage" component={ReferenceManager} nest />
                    <Route path="otus/:otuId" component={OTUDetail} nest />
                    <Route path="otus" component={OTUList} nest />
                    <Route path="indexes/:indexId" component={IndexDetail} nest />
                    <Route path="indexes" component={Indexes} nest />
                    <Route path="settings" component={ReferenceSettings} nest />
                </Switch>
            </ContainerNarrow>

            <EditReference detail={data} />
        </>
    );
}
