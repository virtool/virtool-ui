import { get, includes } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Analyses from "../../../analyses/components/Analyses";
import {
    Icon,
    IconLink,
    LoadingPlaceholder,
    NotFound,
    Tabs,
    TabsLink,
    ViewHeader,
    ViewHeaderAttribution,
    ViewHeaderIcons,
    ViewHeaderTitle,
} from "../../../base";
import { getError } from "../../../errors/selectors";
import { listLabels } from "../../../labels/actions";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { getSample } from "../../actions";
import { getCanModify } from "../../selectors";
import { SampleDetailFiles } from "../Files/Files";
import Quality from "../SampleQuality";
import General from "./General";
import RemoveSample from "./Remove";
import Rights from "./Rights";

function SampleDetail({
    canModify,
    detail,
    error,
    history,
    labels,
    match,
    onGetSample,
    onListLabels,
    onShortlistSubtractions,
    subtractionOptions,
}) {
    const sampleId = match.params.sampleId;

    useEffect(() => {
        onGetSample(sampleId);
        onShortlistSubtractions();
        onListLabels();
    }, [sampleId]);

    if (error) {
        return <NotFound />;
    }

    if (detail === null || labels === null || subtractionOptions === null) {
        return <LoadingPlaceholder />;
    }

    if (!detail.ready) {
        return <LoadingPlaceholder message="Sample is still being created." margin="220px" />;
    }

    let editIcon;
    let removeIcon;
    let rightsTabLink;

    if (canModify) {
        if (includes(history.location.pathname, "general")) {
            editIcon = (
                <Link to={{ state: { editSample: true } }}>
                    <Icon color="orange" name="pencil-alt" tip="Edit" hoverable />
                </Link>
            );
        }

        removeIcon = <IconLink color="red" to={{ state: { removeSample: true } }} name="trash" tip="Remove" />;

        rightsTabLink = (
            <TabsLink to={`/samples/${sampleId}/rights`}>
                <Icon name="key" />
            </TabsLink>
        );
    }

    const { created_at, user } = detail;
    const prefix = `/samples/${sampleId}`;

    return (
        <>
            <ViewHeader title={detail.name}>
                <ViewHeaderTitle>
                    {detail.name}
                    <ViewHeaderIcons>
                        {editIcon}
                        {removeIcon}
                    </ViewHeaderIcons>
                </ViewHeaderTitle>
                <ViewHeaderAttribution time={created_at} user={user.handle} />
            </ViewHeader>

            <Tabs bsStyle="tabs">
                <TabsLink to={`${prefix}/general`}>General</TabsLink>
                <TabsLink to={`${prefix}/files`}>Files</TabsLink>
                <TabsLink to={`${prefix}/quality`}>Quality</TabsLink>
                <TabsLink to={`${prefix}/analyses`}>Analyses</TabsLink>
                {rightsTabLink}
            </Tabs>

            <Switch>
                <Redirect from="/samples/:sampleId" to={`/samples/${sampleId}/general`} exact />
                <Route path="/samples/:sampleId/general" component={General} />
                <Route path="/samples/:sampleId/files" component={SampleDetailFiles} exact />
                <Route path="/samples/:sampleId/quality" component={Quality} />
                <Route path="/samples/:sampleId/analyses" component={Analyses} />
                <Route path="/samples/:sampleId/rights" component={Rights} />
            </Switch>

            <RemoveSample />
        </>
    );
}

export function mapStateToProps(state) {
    return {
        canModify: getCanModify(state),
        detail: state.samples.detail,
        error: getError("GET_SAMPLE_ERROR"),
        labels: get(state, "labels.documents"),
        subtractionOptions: get(state, "subtraction.shortlist", ""),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onGetSample: sampleId => {
            dispatch(getSample(sampleId));
        },
        onShortlistSubtractions: () => {
            dispatch(shortlistSubtractions());
        },
        onListLabels: () => {
            dispatch(listLabels());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleDetail);
