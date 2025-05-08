import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import InitialIcon from "@base/InitialIcon";
import React, { useCallback } from "react";
import styled from "styled-components";

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

const MemberItemButtons = styled.span`
    align-items: center;
    display: flex;
    gap: 4px;
    margin-left: auto;
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

    /** The handle (user) or name of the member user or group */
    handleOrName: string;

    /** Callback to initiate editing the member */
    onEdit: (id: number | string) => void;

    /** Callback to initiate removing the member */
    onRemove: (id: number | string) => void;
};

/**
 * A condensed user or group item for display in the reference members list
 */
export default function MemberItem({
    canModify,
    handleOrName,
    id,
    onEdit,
    onRemove,
}: MemberItemProps) {
    const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
    const handleRemove = useCallback(() => onRemove(id), [id, onRemove]);

    return (
        <StyledMemberItem>
            <MemberItemIcon handle={handleOrName} />
            {handleOrName}
            {canModify && (
                <MemberItemButtons>
                    <Button onClick={handleEdit} size="small">
                        Edit
                    </Button>
                    <Button onClick={handleRemove} size="small" color="red">
                        Remove
                    </Button>
                </MemberItemButtons>
            )}
        </StyledMemberItem>
    );
}
