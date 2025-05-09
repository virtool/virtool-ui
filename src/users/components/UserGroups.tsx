import { useUpdateUser } from "@administration/queries";
import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundSection from "@base/NoneFoundSection";
import PseudoLabel from "@base/PseudoLabel";
import { useListGroups } from "@groups/queries";
import { GroupMinimal } from "@groups/types";
import { map, some, xor } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { UserGroup } from "./UserGroup";

const UserGroupsList = styled(BoxGroup)`
    margin-bottom: 15px;
`;

type UserGroupsType = {
    /** The groups associated with the user */
    memberGroups: GroupMinimal[];

    /** The unique user id */
    userId: string;
};

/**
 * A list of user groups
 */
export default function UserGroups({ memberGroups, userId }: UserGroupsType) {
    const { data, isPending } = useListGroups();
    const mutation = useUpdateUser();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    function handleEdit(groupId: number) {
        mutation.mutate({
            userId,
            update: { groups: xor(map(memberGroups, "id"), [groupId]) },
        });
    }

    return (
        <div>
            <PseudoLabel>Groups</PseudoLabel>
            <UserGroupsList>
                {data.length ? (
                    map(data, ({ id, name }) => (
                        <UserGroup
                            key={id}
                            id={id}
                            name={name}
                            toggled={some(memberGroups, { id })}
                            onClick={handleEdit}
                        />
                    ))
                ) : (
                    <NoneFoundSection key="noneFound" noun="groups" />
                )}
            </UserGroupsList>
        </div>
    );
}
