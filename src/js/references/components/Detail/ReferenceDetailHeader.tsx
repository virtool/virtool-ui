import { Icon, ViewHeader, ViewHeaderAttribution, ViewHeaderIcons, ViewHeaderTitle } from "@base";
import { IconButton } from "@base/IconButton";
import { endsWith } from "lodash-es";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
import { ReferenceRight, useCheckReferenceRight } from "../../hooks";

type ReferenceDetailHeaderProps = {
    createdAt: string;
    /** Whether the reference is installed remotely */
    isRemote: boolean;
    name: string;
    refId: string;
    userHandle: string;
};

/**
 * Displays header for reference with option to edit reference
 */
export default function ReferenceDetailHeader({
    createdAt,
    isRemote,
    name,
    refId,
    userHandle,
}: ReferenceDetailHeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify);

    const showIcons = endsWith(location.pathname, "/manage");

    return (
        <ViewHeader title={name}>
            <ViewHeaderTitle>
                {name}
                {showIcons && (
                    <ViewHeaderIcons>
                        {isRemote && <Icon color="grey" name="lock" aria-label="lock" />}
                        {!isRemote && canModify && (
                            <IconButton
                                color="grayDark"
                                name="pen"
                                tip="modify"
                                onClick={() => navigate(".", { state: { editReference: true } })}
                            />
                        )}
                    </ViewHeaderIcons>
                )}
            </ViewHeaderTitle>
            <ViewHeaderAttribution time={createdAt} user={userHandle} />
        </ViewHeader>
    );
}
