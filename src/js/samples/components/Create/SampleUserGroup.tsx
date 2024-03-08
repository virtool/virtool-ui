import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { InputGroup, InputLabel, InputSelect } from "../../../base";
import { GroupMinimal } from "../../../groups/types";

const SampleUserGroupItem = styled.option`
    text-transform: capitalize;
`;

type SampleUserGroupProps = {
    selected: string;
    groups: GroupMinimal[];
    /** A callback function to handle the user group change */
    onChange: () => void;
};

/**
 * A dropdown showing the user groups and its options
 */
export function SampleUserGroup({ selected, groups, onChange }: SampleUserGroupProps) {
    const groupComponents = map(groups, group => (
        <SampleUserGroupItem key={group.id} value={group.id}>
            {group.name}
        </SampleUserGroupItem>
    ));

    return (
        <InputGroup>
            <InputLabel htmlFor="userGroups">User Group</InputLabel>
            <InputSelect id="userGroups" value={selected} onChange={onChange}>
                <option key="none" value="none">
                    None
                </option>
                {groupComponents}
            </InputSelect>
        </InputGroup>
    );
}
