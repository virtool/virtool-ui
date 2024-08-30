import { Checkbox, SelectBoxGroupSection } from "@base";
import React from "react";
import styled from "styled-components";

const StyledUserGroup = styled(SelectBoxGroupSection)`
    text-transform: capitalize;
    user-select: none;
`;

type UserGroupTypes = {
    /** The group unique id */
    id: string | number;
    /** The group name */
    name: string;
    /** Whether the group is selected */
    toggled: boolean;
    /** A callback function to handle the selection of a group */
    onClick: (id: string | number) => void;
};

/**
 * A condensed user group for use in a list of user groups
 */
export function UserGroup({ id, name, toggled, onClick }: UserGroupTypes) {
    return (
        <StyledUserGroup active={toggled} onClick={() => onClick(id)}>
            <Checkbox checked={toggled} label={name} />
        </StyledUserGroup>
    );
}
