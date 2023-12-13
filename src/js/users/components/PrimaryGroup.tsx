import { capitalize, map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { useUpdateUser } from "../../administration/querys";
import { InputGroup, InputLabel, InputSelect } from "../../base";
import { GroupMinimal } from "../../groups/types";

export const PrimaryGroupOption = styled.option`
    text-transform: capitalize;
`;

type PrimaryGroupProps = {
    /** The groups associated with the user */
    groups: GroupMinimal[];
    /** The users unique id */
    id: string;
    /** The users primary group */
    primaryGroup: GroupMinimal;
};

/**
 * A dropdown showing the primary group and its options
 */
export default function PrimaryGroup({ groups, id, primaryGroup }: PrimaryGroupProps) {
    const mutation = useUpdateUser();

    function handleSetPrimaryGroup(e) {
        mutation.mutate({
            userId: id,
            update: { primary_group: e.target.value === "none" ? null : e.target.value },
        });
    }

    return (
        <InputGroup>
            <InputLabel>Primary Group</InputLabel>
            <InputSelect value={primaryGroup?.id || "none"} onChange={handleSetPrimaryGroup}>
                <option key="none" value="none">
                    None
                </option>
                {map(groups, ({ id, name }) => (
                    <PrimaryGroupOption key={id} value={id}>
                        {capitalize(name)}
                    </PrimaryGroupOption>
                ))}
            </InputSelect>
        </InputGroup>
    );
}
