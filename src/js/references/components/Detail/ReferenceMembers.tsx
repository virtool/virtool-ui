import { map } from "lodash-es";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useCheckAdminRole } from "../../../administration/hooks";
import { AdministratorRoles } from "../../../administration/types";
import { BoxGroup, BoxGroupHeader, BoxGroupSection, Icon } from "../../../base";
import { useRemoveReferenceUser } from "../../querys";
import { ReferenceGroup, ReferenceUser } from "../../types";
import AddReferenceMember from "./AddReferenceMember";
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
    data: any;
    /** The list of users or groups associated with the reference */
    members: ReferenceGroup[] | ReferenceUser[];
    /** Whether the member is a user or a group */
    noun: string;
    refId: string;
    term?: string;
    setTerm?: any;
    fetchNextPage?: any;
    isFetchingNextPage?: any;
    isLoading?: any;
};

/**
 * Displays a component for managing who can access a reference by users or groups
 */
export default function ReferenceMembers({
    data,
    members,
    noun,
    refId,
    term,
    setTerm,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
}: ReferenceMembersProps) {
    const history = useHistory();
    const { hasPermission: canModify } = useCheckAdminRole(AdministratorRoles.USERS);

    const mutation = useRemoveReferenceUser(refId, noun);

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
            <AddReferenceMember
                data={data}
                show={history.location.state && history.location.state[`add${noun}`]}
                members={members}
                noun={noun}
                refId={refId}
                onHide={handleHide}
                setTerm={setTerm}
                term={term}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
            />
            <EditReferenceMember
                show={history.location.state && history.location.state[`edit${noun}`]}
                noun={noun}
                onHide={handleHide}
            />
        </>
    );
}
