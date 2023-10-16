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
    canModify: boolean;
    id: number | string;
    name?: string;
    handle?: string;
    onEdit: (id: number | string) => void;
    onRemove: (id: number | string) => void;
};

/**
 * A user or group for display in the reference members list.
 *
 * @param canModify - Whether the current user can modify members in the list.
 * @param id - The unique identifier for the member.
 * @param name - The name of the member.
 * @param handle - The handle of the member.
 * @param onEdit - Callback to initiate editing the member.
 * @param onRemove - Callback to initiate removing the member.
 * @returns A condensed member item.
 */
function MemberItem({ canModify, id, name, handle, onEdit, onRemove }: MemberItemProps) {
    const displayName = handle || name || "";
    const handleEdit = useCallback(() => onEdit(id), [id]);
    const handleRemove = useCallback(() => onRemove(id), [id]);

    let icons;

    if (canModify) {
        icons = (
            <MemberItemIcons>
                <Icon name="edit" color="orange" tip="Modify" onClick={handleEdit} />
                <Icon name="trash" color="red" tip="Remove" onClick={handleRemove} />
            </MemberItemIcons>
        );
    }

    return (
        <StyledMemberItem>
            <MemberItemIcon handle={displayName} />
            {displayName}
            {icons}
        </StyledMemberItem>
    );
}

export default MemberItem;
