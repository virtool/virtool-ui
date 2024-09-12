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
import { useLocationState } from "@utils/hooks";
import { includes } from "lodash-es";
import React from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom-v5-compat";
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
    const location = useLocation();
    const [, setLocationState] = useLocationState();
    const { sampleId } = useParams();
    const { data, isPending, isError } = useFetchSample(sampleId);
    const { hasPermission: canModify } = useCheckCanEditSample(sampleId);

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
        if (includes(location.pathname, "general")) {
            editIcon = (
                <IconButton
                    color="grayDark"
                    name="pen"
                    tip="modify"
                    onClick={() => setLocationState({ editSample: true })}
                />
            );
        }

        removeIcon = (
            <IconButton
                color="red"
                name="trash"
                tip="remove"
                onClick={() => setLocationState({ removeSample: true })}
            />
        );

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
                {data.ready && (
                    <>
                        <TabsLink to={`${prefix}/files`}>Files</TabsLink>
                        <TabsLink to={`${prefix}/quality`}>Quality</TabsLink>
                        <TabsLink to={`${prefix}/analyses`}>Analyses</TabsLink>
                        {rightsTabLink}
                    </>
                )}
            </Tabs>

            <Routes>
                <Route path="" element={<Navigate to={`/samples/${sampleId}/general`} replace />} />
                <Route path="/general" element={<General />} />
                <Route path="/files" element={<SampleDetailFiles />} />
                <Route path="/quality" element={<Quality />} />
                <Route path="/analyses" element={<Analyses />} />
                <Route path="/rights" element={<Rights />} />
            </Routes>

            <RemoveSample id={sampleId} name={name} />
        </>
    );
}
