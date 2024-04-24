import { find, map } from "lodash-es";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader, BoxGroupSection, Icon } from "../../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../hooks";
import { useRemoveReferenceUser } from "../../queries";
import { ReferenceGroup, ReferenceUser } from "../../types";
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
export default function ReferenceMembers({ members, noun, refId }: ReferenceMembersProps) {
    const history = useHistory();
    const location = useLocation<{ addgroup: boolean; adduser: boolean }>();

    const mutation = useRemoveReferenceUser(refId, noun);
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify);

    function handleHide() {
        history.replace({ state: { [`add${noun}`]: false } });
        history.replace({ state: { [`edit${noun}`]: false } });
    }

    const plural = `${noun}s`;

    return (
        <>
            <BoxGroup>
                <ReferenceMembersHeader>
                    <h2>
                        {plural}
                        {canModify && (
                            <NewMemberLink onClick={() => history.push({ state: { [`add${noun}`]: true } })}>
                                Add {noun}
                            </NewMemberLink>
                        )}
                    </h2>
                    <p>Manage membership and rights for reference {plural}.</p>
                </ReferenceMembersHeader>
                {members.length ? (
                    map(members, member => (
                        <MemberItem
                            key={member.id}
                            {...member}
                            canModify={canModify}
                            onEdit={id => history.push({ state: { [`edit${noun}`]: id } })}
                            onRemove={id => mutation.mutate({ id })}
                        />
                    ))
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
                    show={location.state?.adduser}
                />
            ) : (
                <AddReferenceGroup
                    groups={members as ReferenceGroup[]}
                    onHide={handleHide}
                    refId={refId}
                    show={location.state?.addgroup}
                />
            )}
            <EditReferenceMember
                show={location.state?.[`edit${noun}`]}
                member={find(members, { id: location.state?.[`edit${noun}`] })}
                noun={noun}
                refId={refId}
                onHide={handleHide}
            />
        </>
    );
}
