import { BoxGroupSection, Button, InitialIcon } from "@base";
import { cn } from "@utils/utils";
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
        <BoxGroupSection className={cn("items-center", "flex")}>
            <MemberItemIcon handle={displayName} />
            {displayName}
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
        </BoxGroupSection>
    );
}
