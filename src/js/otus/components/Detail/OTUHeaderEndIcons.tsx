import { IconButton } from "@base/IconButton";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
import EditOTU from "./EditOTU";
import RemoveOTU from "./RemoveOTU";

type OTUHeaderEndIconsProps = {
    id: string;
    name: string;
    refId: string;
    abbreviation: string;
};

/**
 * Displays end icons to edit or remove an OTU
 */
export function OTUHeaderEndIcons({ id, name, refId, abbreviation }: OTUHeaderEndIconsProps) {
    const [, setOpenEditOTU] = useUrlSearchParam("openEditOTU");
    const [, setOpenRemoveOTU] = useUrlSearchParam("openRemoveOTU");
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);

    return canModify ? (
        <>
            <IconButton
                key="edit-icon"
                color="grayDark"
                name="pen"
                tip="edit OTU"
                onClick={() => setOpenEditOTU("true")}
            />
            <IconButton
                key="remove-icon"
                color="red"
                name="trash"
                tip="remove OTU"
                onClick={() => setOpenRemoveOTU("true")}
            />

            <EditOTU otuId={id} name={name} abbreviation={abbreviation} />
            <RemoveOTU id={id} name={name} refId={refId} />
        </>
    ) : null;
}
