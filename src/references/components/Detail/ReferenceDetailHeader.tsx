import { useDialogParam } from "@app/hooks";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { endsWith } from "lodash-es";
import React from "react";
import { useLocation } from "wouter";

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
    const [location] = useLocation();
    const { setOpen: setOpenEditReference } =
        useDialogParam("openEditReference");
    const { hasPermission: canModify } = useCheckReferenceRight(
        refId,
        ReferenceRight.modify,
    );

    const showIcons = endsWith(location, "/manage");

    return (
        <ViewHeader title={name}>
            <ViewHeaderTitle>
                {name}
                {showIcons && (
                    <ViewHeaderIcons>
                        {isRemote && (
                            <Icon color="grey" name="lock" aria-label="lock" />
                        )}
                        {!isRemote && canModify && (
                            <IconButton
                                color="grayDark"
                                name="pen"
                                tip="modify"
                                onClick={() => setOpenEditReference(true)}
                            />
                        )}
                    </ViewHeaderIcons>
                )}
            </ViewHeaderTitle>
            <ViewHeaderAttribution time={createdAt} user={userHandle} />
        </ViewHeader>
    );
}
