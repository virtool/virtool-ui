import { ContainerNarrow, LoadingPlaceholder, NotFound } from "@base";
import IndexDetail from "@indexes/components/IndexDetail";
import { useGetReference } from "@references/queries";
import React from "react";
import { match, Redirect, Route, Switch } from "react-router-dom";
import Indexes from "../../../indexes/components/Indexes";
import OTUDetail from "../../../otus/components/Detail/OTUDetail";
import OTUList from "../../../otus/components/OTUList";
import EditReference from "./EditReference";
import ReferenceDetailHeader from "./ReferenceDetailHeader";
import ReferenceDetailTabs from "./ReferenceDetailTabs";
import ReferenceManager from "./ReferenceManager";
import ReferenceSettings from "./ReferenceSettings";

type ReferenceDetailProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

/**
 * The detailed view for a reference
 */
export default function ReferenceDetail({ match }: ReferenceDetailProps) {
    const { refId } = match.params;
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
                <Route path="/refs/:refId/otus/:otuId" />
                <Route path="/refs">
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
                    <Route path="/refs/:refId" render={() => <Redirect to={`/refs/${refId}/manage`} exact />} />
                    <Route path="/refs/:refId/manage" component={ReferenceManager} />
                    <Route path="/refs/:refId/otus" component={OTUList} exact />
                    <Route path="/refs/:refId/otus/:otuId" component={OTUDetail} />
                    <Route path="/refs/:refId/indexes" component={Indexes} exact />
                    <Route path="/refs/:refId/indexes/:indexId" component={IndexDetail} />
                    <Route path="/refs/:refId/settings" component={ReferenceSettings} />
                </Switch>
            </ContainerNarrow>

            <EditReference detail={data} />
        </>
    );
}
