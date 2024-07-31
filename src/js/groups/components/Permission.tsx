import { BoxGroupSectionSelect, Checkbox } from "@base";
import React from "react";
import styled from "styled-components";

const StyledGroupPermission = styled(BoxGroupSectionSelect)`
    background-color: ${props => (props.active ? props.theme.color.blue : "white")};
    user-select: none;
`;

type GroupPermissionProps = {
    /** Whether the permission is currently active */
    active: boolean;
    /** The name of the permission */
    permission: string;
    /** Handles click event when permission is clicked */
    onClick: () => void;
};

/**
 * Group permission checkbox
 */
export function GroupPermission({ active, permission, onClick }: GroupPermissionProps) {
    return (
        <StyledGroupPermission active={active} onClick={onClick}>
            <Checkbox checked={active} label={permission} />
        </StyledGroupPermission>
    );
}
