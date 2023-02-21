import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { InputGroup, InputLabel, InputSelect } from "../../../base";

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
            <InputSelect value={selected} onChange={onChange}>
                <option key="none" value="none">
                    None
                </option>
                {groupComponents}
            </InputSelect>
        </InputGroup>
    );
};
