import React, { useCallback } from "react";
import styled from "styled-components";
import { BoxGroupSection, Icon, InitialIcon } from "../../../base";

const StyledMemberItemIcon = styled.div`
    align-items: center;
    display: flex;
    padding-right: 8px;
`;

function MemberItemIcon({ handle }) {
    return (
        <StyledMemberItemIcon>
            <InitialIcon handle={handle} size="lg" />
        </StyledMemberItemIcon>
    );
}

const MemberItemIcons = styled.span`
    align-items: center;
    display: flex;
    margin-left: auto;

    i {
        margin-left: 5px;
    }
`;

const StyledMemberItem = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
`;

type MemberItemProps = {
    /** Whether the current user can modify members in the list */
    canModify: boolean;
    /** The unique identifier for the member */
    id: number | string;
    /** The name of the member */
    name?: string;
    /** The handle of the member */
    handle?: string;
    /** Callback to initiate editing the member */
    onEdit: (id: number | string) => void;
    /** Callback to initiate removing the member */
    onRemove: (id: number | string) => void;
};

/**
 * A condensed user or group item for display in the reference members list
 */
export default function MemberItem({ canModify, id, name, handle, onEdit, onRemove }: MemberItemProps) {
    const displayName = handle || name || "";
    const handleEdit = useCallback(() => onEdit(id), [id]);
    const handleRemove = useCallback(() => onRemove(id), [id]);

    return (
        <StyledMemberItem>
            <MemberItemIcon handle={displayName} />
            {displayName}
            {canModify && (
                <MemberItemIcons>
                    <Icon aria-label="edit" name="edit" color="orange" tip="Modify" onClick={handleEdit} />
                    <Icon aria-label="remove" name="trash" color="red" tip="Remove" onClick={handleRemove} />
                </MemberItemIcons>
            )}
        </StyledMemberItem>
    );
}
