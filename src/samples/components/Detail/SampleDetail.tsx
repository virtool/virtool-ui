import { useDialogParam, usePathParams } from "@app/hooks";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import React from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import Analyses from "../../../analyses/components/Analyses";
import { useCheckCanEditSample } from "../../hooks";
import { useFetchSample } from "../../queries";
import SampleDetailFiles from "../Files/SampleDetailFiles";
import Quality from "../SampleQuality";
import RemoveSample from "./RemoveSample";
import General from "./SampleDetailGeneral";
import Rights from "./SampleRights";

/**
 * The detailed view for managing samples
 */
export default function SampleDetail() {
    const [location] = useLocation();
    const { sampleId } = usePathParams<{ sampleId: string }>();
    const { data, isPending, isError } = useFetchSample(sampleId);
    const { hasPermission: canModify } = useCheckCanEditSample(sampleId);
    const { setOpen: setOpenEditSample } = useDialogParam("openEditSample");
    const { setOpen: setOpenRemoveSample } = useDialogParam("openRemoveSample");

    if (isError) {
        return <NotFound />;
    }

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    let editIcon;
    let removeIcon;
    let rightsTabLink;

    if (canModify) {
        if (location.endsWith("/general")) {
            editIcon = (
                <IconButton
                    color="grayDark"
                    name="pen"
                    tip="modify"
                    onClick={() => setOpenEditSample(true)}
                />
            );

            removeIcon = (
                <IconButton
                    color="red"
                    name="trash"
                    tip="remove"
                    onClick={() => setOpenRemoveSample(true)}
                />
            );
        }

        rightsTabLink = (
            <TabsLink to={`/samples/${sampleId}/rights`}>
                <Icon name="key" />
            </TabsLink>
        );
    }

    const { created_at, name, user } = data;

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
                <TabsLink to={`/samples/${sampleId}/general`}>General</TabsLink>
                {data.ready && (
                    <>
                        <TabsLink to={`/samples/${sampleId}/files`}>
                            Files
                        </TabsLink>
                        <TabsLink to={`/samples/${sampleId}/quality`}>
                            Quality
                        </TabsLink>
                        <TabsLink to={`/samples/${sampleId}/analyses`}>
                            Analyses
                        </TabsLink>
                        {rightsTabLink}
                    </>
                )}
            </Tabs>

            <Switch>
                <Route path="/samples/:sampleId/general" component={General} />
                <Route
                    path="/samples/:sampleId/files"
                    component={SampleDetailFiles}
                />
                <Route path="/samples/:sampleId/quality" component={Quality} />
                <Route
                    path="/samples/:sampleId/analyses/*?"
                    component={Analyses}
                />
                <Route path="/samples/:sampleId/rights" component={Rights} />
                <Route
                    path="/samples/:sampleId/"
                    component={() => (
                        <Redirect to={`/samples/${sampleId}/general`} replace />
                    )}
                />
            </Switch>

            <RemoveSample id={sampleId} name={name} />
        </>
    );
}
