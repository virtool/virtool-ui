import { map, some, xor } from "lodash-es";
import React from "react";
import styled from "styled-components";

import { useUpdateUser } from "../../administration/queries";
import { BoxGroup, LoadingPlaceholder, NoneFoundSection } from "../../base";
import { useListGroups } from "../../groups/queries";
import { GroupMinimal } from "../../groups/types";
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
    const { data: documents, isLoading } = useListGroups();
    const mutation = useUpdateUser();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    function handleEdit(groupId: string | number) {
        mutation.mutate({ userId, update: { groups: xor(map(memberGroups, "id"), [groupId]) } });
    }

    return (
        <div>
            <label>Groups</label>
            <UserGroupsList>
                {documents.length ? (
                    map(documents, ({ id, name }) => (
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
