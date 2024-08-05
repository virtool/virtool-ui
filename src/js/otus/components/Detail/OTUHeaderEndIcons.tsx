import { IconButton } from "@base/IconButton";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { useLocationState } from "@utils/hooks";
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
    const [_, setLocationState] = useLocationState();
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);

    return canModify ? (
        <>
            <IconButton
                key="edit-icon"
                color="grayDark"
                name="pen"
                tip="Edit OTU"
                onClick={() => setLocationState({ editOTU: true })}
            />
            <IconButton
                key="remove-icon"
                color="red"
                name="trash"
                tip="Remove OTU"
                onClick={() => setLocationState({ removeOTU: true })}
            />

            <EditOTU otuId={id} name={name} abbreviation={abbreviation} />
            <RemoveOTU id={id} name={name} refId={refId} />
        </>
    ) : null;
}
