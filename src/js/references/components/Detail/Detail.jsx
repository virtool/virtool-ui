import { get } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ContainerNarrow, LoadingPlaceholder, NotFound } from "../../../base";
import IndexDetail from "../../../indexes/components/Detail";
import Indexes from "../../../indexes/components/Indexes";
import OTUDetail from "../../../otus/components/Detail/OTUDetail";
import OTUList from "../../../otus/components/OTUList";
import { getReference } from "../../actions";
import { checkReferenceRight, getReferenceDetail } from "../../selectors";
import EditReference from "./EditReference";
import ReferenceDetailHeader from "./ReferenceDetailHeader";
import ReferenceManager from "./ReferenceManager";
import ReferenceSettings from "./ReferenceSettings";
import ReferenceDetailTabs from "./Tabs";

const ReferenceDetail = ({ error, id, match, onGetReference, detail }) => {
    const matchId = match.params.refId;

    useEffect(() => onGetReference(matchId), [matchId]);

    if (error) {
        return <NotFound />;
    }

    if (!id || id !== matchId) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <Switch>
                <Route path="/refs/:refId/otus/:otuId" />
                <Route path="/refs">
                    <ReferenceDetailHeader
                        createdAt={detail.created_at}
                        isRemote={Boolean(detail.remotes_from)}
                        name={detail.name}
                        userHandle={detail.user.handle}
                        refId={matchId}
                    />
                    <ReferenceDetailTabs />
                </Route>
            </Switch>

            <ContainerNarrow>
                <Switch>
                    <Redirect from="/refs/:refId" to={`/refs/${id}/manage`} exact />
                    <Route path="/refs/:refId/manage" component={ReferenceManager} />
                    <Route path="/refs/:refId/otus" component={OTUList} exact />
                    <Route path="/refs/:refId/otus/:otuId" component={OTUDetail} />
                    <Route path="/refs/:refId/indexes" component={Indexes} exact />
                    <Route path="/refs/:refId/indexes/:indexId" component={IndexDetail} />
                    <Route path="/refs/:refId/settings" component={ReferenceSettings} />
                </Switch>
            </ContainerNarrow>

            <EditReference />
        </>
    );
};

const mapStateToProps = state => ({
    canModify: checkReferenceRight(state, "modify"),
    error: get(state, "errors.GET_REFERENCE_ERROR", null),
    id: get(state, "references.detail.id"),
    pathname: state.router.location.pathname,
    detail: getReferenceDetail(state),
});

const mapDispatchToProps = dispatch => ({
    onGetReference: refId => {
        dispatch(getReference(refId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceDetail);
