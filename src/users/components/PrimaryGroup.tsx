import { useUpdateUser } from "@administration/queries";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSelect from "@base/InputSelect";
import { GroupMinimal } from "@groups/types";
import { capitalize } from "es-toolkit/string";
import styled from "styled-components";

export const PrimaryGroupOption = styled.option`
    text-transform: capitalize;
`;

type PrimaryGroupProps = {
    /** The groups associated with the user */
    groups: GroupMinimal[];
    /** The users unique id */
    id: number;
    /** The users primary group */
    primaryGroup: GroupMinimal;
};

/**
 * A dropdown showing the primary group and its options
 */
export default function PrimaryGroup({
    groups,
    id,
    primaryGroup,
}: PrimaryGroupProps) {
    const mutation = useUpdateUser();

    function handleSetPrimaryGroup(e) {
        mutation.mutate({
            userId: id,
            update: {
                primary_group:
                    e.target.value === "none" ? null : e.target.value,
            },
        });
    }

    return (
        <InputGroup>
            <InputLabel>Primary Group</InputLabel>
            <InputSelect
                value={primaryGroup?.id || "none"}
                onChange={handleSetPrimaryGroup}
            >
                <option key="none" value="none">
                    None
                </option>
                {groups.map(({ id, name }) => (
                    <PrimaryGroupOption key={id} value={id}>
                        {capitalize(name)}
                    </PrimaryGroupOption>
                ))}
            </InputSelect>
        </InputGroup>
    );
}
