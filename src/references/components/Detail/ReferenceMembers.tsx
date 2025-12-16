import { objectHasProperty } from "@app/common";
import { useDialogParam, useUrlSearchParam } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { useRemoveReferenceUser } from "@references/queries";
import { ReferenceGroup, ReferenceUser } from "@references/types";
import styled from "styled-components";
import AddReferenceGroup from "./AddReferenceGroup";
import AddReferenceUser from "./AddReferenceUser";
import EditReferenceMember from "./EditMember";
import MemberItem from "./MemberItem";

const NewMemberLink = styled.a`
    cursor: pointer;
    margin-left: auto;
`;

const NoMembers = styled(BoxGroupSection)`
    align-items: center;
    justify-content: center;
    display: flex;

    i {
        padding-right: 3px;
    }
`;

const ReferenceMembersHeader = styled(BoxGroupHeader)`
    padding-bottom: 10px;

    h2 {
        text-transform: capitalize;
    }
`;

type ReferenceMembersProps = {
    /** The list of users or groups associated with the reference */
    members: ReferenceGroup[] | ReferenceUser[];

    /** Whether the member is a user or a group */
    noun: string;

    refId: string;
};

/**
 * Displays a component for managing who can access a reference by users or groups
 */
export default function ReferenceMembers({
    members,
    noun,
    refId,
}: ReferenceMembersProps) {
    const { open: openAdd, setOpen: setOpenAdd } = useDialogParam(
        `openAdd${noun}`,
    );
    const {
        value: editId,
        setValue: setEditId,
        unsetValue: unsetEditId,
    } = useUrlSearchParam<string>(`edit${noun}Id`);

    const mutation = useRemoveReferenceUser(refId, noun);
    const { hasPermission: canModify } = useCheckReferenceRight(
        refId,
        ReferenceRight.modify,
    );

    function handleHide() {
        setOpenAdd(false);
        unsetEditId();
    }

    const plural = `${noun}s`;

    return (
        <>
            <BoxGroup>
                <ReferenceMembersHeader>
                    <h2>
                        {plural}
                        {canModify && (
                            <NewMemberLink onClick={() => setOpenAdd(true)}>
                                Add {noun}
                            </NewMemberLink>
                        )}
                    </h2>
                    <p>Manage membership and rights for reference {plural}.</p>
                </ReferenceMembersHeader>
                {members.length ? (
                    members.map((member: ReferenceGroup | ReferenceUser) => {
                        const handleOrName = objectHasProperty(member, "handle")
                            ? (member as ReferenceUser).handle
                            : (member as ReferenceGroup).name;

                        return (
                            <MemberItem
                                key={member.id}
                                canModify={canModify}
                                handleOrName={handleOrName}
                                id={member.id}
                                onEdit={(id) => setEditId(String(id))}
                                onRemove={(id) => mutation.mutate({ id })}
                            />
                        );
                    })
                ) : (
                    <NoMembers>
                        <Icon name="exclamation-circle" /> None Found
                    </NoMembers>
                )}
            </BoxGroup>
            {noun === "user" ? (
                <AddReferenceUser
                    users={members as ReferenceUser[]}
                    onHide={handleHide}
                    refId={refId}
                    show={openAdd}
                />
            ) : (
                <AddReferenceGroup
                    groups={members as ReferenceGroup[]}
                    onHide={handleHide}
                    refId={refId}
                    show={openAdd}
                />
            )}
            <EditReferenceMember
                member={members.find(
                    (member: ReferenceGroup | ReferenceUser) =>
                        member.id === editId,
                )}
                noun={noun}
                refId={refId}
            />
        </>
    );
}
