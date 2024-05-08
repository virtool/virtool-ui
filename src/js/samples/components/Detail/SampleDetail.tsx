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
} from "@base";
import { useCheckCanEditSample } from "@samples/hooks";
import { useFetchSample } from "@samples/queries";
import { includes } from "lodash-es";
import React from "react";
import { Link, match, Redirect, Route, Switch, useLocation } from "react-router-dom";
import Analyses from "../../../analyses/components/Analyses";
import { SampleDetailFiles } from "../Files/SampleDetailFiles";
import Quality from "../SampleQuality";
import RemoveSample from "./RemoveSample";
import General from "./SampleDetailGeneral";
import Rights from "./SampleRights";

type SampleDetailProps = {
    /** Match object containing path information */
    match: match<{ sampleId: string }>;
};

/**
 * The detailed view for managing samples
 */
export default function SampleDetail({ match }: SampleDetailProps) {
    const location = useLocation();
    const { sampleId } = match.params;
    const { data, isLoading, isError } = useFetchSample(sampleId);
    const { hasPermission: canModify } = useCheckCanEditSample(sampleId);

    if (isError) {
        return <NotFound />;
    }

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    if (!data.ready) {
        return <LoadingPlaceholder message="Sample is still being created." margin="220px" />;
    }

    let editIcon;
    let removeIcon;
    let rightsTabLink;

    if (canModify) {
        if (includes(location.pathname, "general")) {
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

    const { created_at, name, user } = data;
    const prefix = `/samples/${sampleId}`;

    return (
        <>
            <ViewHeader title={name}>
                <ViewHeaderTitle>
                    {name}
                    <ViewHeaderIcons>
                        {editIcon}
                        {removeIcon}
                    </ViewHeaderIcons>
                </ViewHeaderTitle>
                <ViewHeaderAttribution time={created_at} user={user.handle} />
            </ViewHeader>

            <Tabs>
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

            <RemoveSample id={sampleId} name={name} />
        </>
    );
}
