import React from "react";
import styled from "styled-components";
import { IconLink } from "../../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../../references/hooks";
import EditOTU from "./EditOTU";
import RemoveOTU from "./RemoveOTU";

type OTUHeaderEndIconsProps = {
    id: string;
    name: string;
    refId: string;
    abbreviation: string;
};

const EditOTUIcon = styled(IconLink)`
    margin: 0 5px;
`;

const RemoveOTUIcon = styled(IconLink)`
    margin: 0 5px;
`;

/**
 * Displays end icons to edit or remove an OTU
 */
export function OTUHeaderEndIcons({ id, name, refId, abbreviation }: OTUHeaderEndIconsProps) {
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);

    return canModify ? (
        <>
            <EditOTUIcon
                key="edit-icon"
                color="orange"
                name="pencil-alt"
                tip="Edit OTU"
                to={{ state: { editOTU: true } }}
            />
            <RemoveOTUIcon
                key="remove-icon"
                color="red"
                name="trash"
                tip="Remove OTU"
                to={{ state: { removeOTU: true } }}
            />

            <EditOTU otuId={id} name={name} abbreviation={abbreviation} />
            <RemoveOTU id={id} name={name} refId={refId} />
        </>
    ) : null;
}
