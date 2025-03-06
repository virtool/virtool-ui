import { IconButton } from "@base/IconButton";
import { useDialogParam } from "@/hooks";
import { endsWith } from "lodash-es";
import React from "react";
import { useLocation } from "wouter";
import {
    Icon,
    ViewHeader,
    ViewHeaderAttribution,
    ViewHeaderIcons,
    ViewHeaderTitle,
} from "@base/index";
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
