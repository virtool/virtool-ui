import { map } from "lodash-es";
import React from "react";
import { InfiniteData } from "react-query";
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "react-query/types/core/types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader, BoxGroupSection, Icon } from "../../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../hooks";
import { GroupSearchResults } from "../../../groups/types";
import { UserResponse } from "../../../users/types";
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
    /** The data of the member on the current page */
    data: InfiniteData<GroupSearchResults | UserResponse>;
    /** Fetches the next page of data */
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>;
    /** Whether the next page is being fetched */
    isFetchingNextPage: boolean;
    /** Whether the data is loading */
    isLoading: boolean;
    /** The list of users or groups associated with the reference */
    members: ReferenceGroup[] | ReferenceUser[];
    /** Whether the member is a user or a group */
    noun: string;
    refId: string;
    /** A function to handle input change */
    setTerm: (term: string) => void;
    /** The search term to filter the data by */
    term: string;
};

/**
 * Displays a component for managing who can access a reference by users or groups
 */
export default function ReferenceMembers({
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    members,
    noun,
    refId,
    setTerm,
    term,
}: ReferenceMembersProps) {
    const history = useHistory();
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify);

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
