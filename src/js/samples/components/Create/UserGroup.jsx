import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { InputGroup, InputLabel, Select } from "../../../base";

const SampleUserGroupItem = styled.option`
    text-transform: capitalize;
`;

export const SampleUserGroup = ({ selected, groups, onChange }) => {
    const groupComponents = map(groups, group => (
        <SampleUserGroupItem key={group.id} value={group.id}>
            {group.name}
        </SampleUserGroupItem>
    ));

    return (
        <InputGroup>
            <InputLabel>User Group</InputLabel>
            <Select value={selected} onChange={onChange}>
                <option key="none" value="none">
                    None
                </option>
                {groupComponents}
            </Select>
        </InputGroup>
    );
};
