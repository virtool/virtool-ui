import {
    Icon,
    LoadingPlaceholder,
    NotFound,
    Tabs,
    TabsLink,
    ViewHeader,
    ViewHeaderAttribution,
    ViewHeaderIcons,
    ViewHeaderTitle,
} from "@base";
import { IconButton } from "@base/IconButton";
import { useCheckCanEditSample } from "@samples/hooks";
import { useFetchSample } from "@samples/queries";
import React from "react";
import { Redirect, Route, Switch, useLocation, useParams } from "wouter";
import Analyses from "../../../analyses/components/Analyses";
import { SampleDetailFiles } from "../Files/SampleDetailFiles";
import Quality from "../SampleQuality";
import RemoveSample from "./RemoveSample";
import General from "./SampleDetailGeneral";
import Rights from "./SampleRights";

/**
 * The detailed view for managing samples
 */
export default function SampleDetail() {
    const [location, navigate] = useLocation();
    const { sampleId } = useParams<{ sampleId: string }>();
    const { data, isPending, isError } = useFetchSample(sampleId);
    const { hasPermission: canModify } = useCheckCanEditSample(sampleId);
    console.log({ sampleId });

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
        if (location === "/general") {
            editIcon = (
                <IconButton
                    color="grayDark"
                    name="pen"
                    tip="modify"
                    onClick={() => navigate("/general?openEditSample=true")}
                />
            );

            removeIcon = (
                <IconButton
                    color="red"
                    name="trash"
                    tip="remove"
                    onClick={() => navigate("/general?openRemoveSample=true")}
                />
            );
        }

        rightsTabLink = (
            <TabsLink to={`/rights`}>
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
                <TabsLink to={"/general"}>General</TabsLink>
                {data.ready && (
                    <>
                        <TabsLink to={"/files"}>Files</TabsLink>
                        <TabsLink to={"/quality"}>Quality</TabsLink>
                        <TabsLink to={"/analyses"}>Analyses</TabsLink>
                        {rightsTabLink}
                    </>
                )}
            </Tabs>

            <Switch>
                <Route path="/general" component={General} nest />
                <Route path="/files" component={SampleDetailFiles} nest />
                <Route path="/quality" component={Quality} nest />
                <Route path="/analyses" component={Analyses} nest />
                <Route path="/rights" component={Rights} nest />
                <Route path="/" component={() => <Redirect to={`/general`} replace />} nest />
            </Switch>

            <RemoveSample id={sampleId} name={name} />
        </>
    );
}
