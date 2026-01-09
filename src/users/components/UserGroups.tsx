import { useUpdateUser } from "@administration/queries";
import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundSection from "@base/NoneFoundSection";
import PseudoLabel from "@base/PseudoLabel";
import { useListGroups } from "@groups/queries";
import { GroupMinimal } from "@groups/types";
import { xor } from "es-toolkit/array";
import { UserGroup } from "./UserGroup";

type UserGroupsType = {
    /** The groups associated with the user */
    memberGroups: GroupMinimal[];

    /** The unique user id */
    userId: number;
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
            update: {
                groups: xor(
                    memberGroups.map((g) => g.id),
                    [groupId],
                ),
            },
        });
    }

    return (
        <div>
            <PseudoLabel>Groups</PseudoLabel>
            <BoxGroup className="mb-4">
                {data.length ? (
                    data.map(({ id, name }) => (
                        <UserGroup
                            key={id}
                            id={id}
                            name={name}
                            toggled={memberGroups.some((g) => g.id === id)}
                            onClick={handleEdit}
                        />
                    ))
                ) : (
                    <NoneFoundSection key="noneFound" noun="groups" />
                )}
            </BoxGroup>
        </div>
    );
}
