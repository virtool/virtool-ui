import { map } from "lodash-es";
import React, { useState } from "react";
import styled from "styled-components";
import { useCheckAdminRole } from "../../../administration/hooks";
import { AdministratorRoles } from "../../../administration/types";
import { BoxGroup, BoxGroupHeader, BoxGroupSection, Icon } from "../../../base";
import { useRemoveReferenceUser } from "../../querys";
import { ReferenceGroup, ReferenceUser } from "../../types";
import AddReferenceMember from "./AddMember";
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
export default function ReferenceMembers({ members, noun, refId }: ReferenceMembersProps) {
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const { hasPermission: canModify } = useCheckAdminRole(AdministratorRoles.USERS);

    const mutation = useRemoveReferenceUser(refId, noun);

    function handleHide() {
        setShowAdd(false);
        setShowEdit(false);
    }

    const plural = `${noun}s`;

    let memberComponents;
    if (members.length) {
        memberComponents = map(members, member => (
            <MemberItem
                key={member.id}
                {...member}
                canModify={canModify}
                onEdit={id => setShowEdit(id)}
                onRemove={id => mutation.mutate({ id })}
            />
        ));
    } else {
        memberComponents = (
            <NoMembers>
                <Icon name="exclamation-circle" /> None Found
            </NoMembers>
        );
    }

    return (
        <>
            <BoxGroup>
                <ReferenceMembersHeader>
                    <h2>
                        {plural}
                        {canModify && <NewMemberLink onClick={() => setShowAdd(true)}>Add {noun}</NewMemberLink>}
                    </h2>
                    <p>Manage membership and rights for reference {plural}.</p>
                </ReferenceMembersHeader>
                {memberComponents}
            </BoxGroup>
            <AddReferenceMember show={showAdd} noun={noun} onHide={handleHide} />
            <EditReferenceMember show={showEdit} noun={noun} onHide={handleHide} />
        </>
    );
}
