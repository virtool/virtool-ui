import { getColor } from "@app/theme";
import { BoxGroup, LinkButton, LoadingPlaceholder, RemoveBanner } from "@base";
import { InputHeader } from "@base/InputHeader";
import { find, sortBy } from "lodash-es";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFetchGroup, useListGroups, useRemoveGroup, useUpdateGroup } from "../queries";
import Create from "./CreateGroup";
import { GroupSelector } from "./GroupSelector";
import { Members } from "./Members";
import { Permissions } from "./Permissions";

const ManageGroupsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 15px;
`;

const GroupsHeader = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
`;

const NoneSelectedContainer = styled(BoxGroup)`
    display: flex;
    flex-direction: column;
    background-color: ${props => getColor({ theme: props.theme, color: "greyLightest" })};
    flex: 1 1 auto;
    height: 300px;
`;

export const NoneSelected = styled.div`
    color: ${props => props.theme.color.greyDarkest};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export default function Groups() {
    const updateGroupMutation = useUpdateGroup();
    const removeMutation = useRemoveGroup();

    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const { data: groups, isLoading: isLoadingGroups } = useListGroups();
    const { data: selectedGroup } = useFetchGroup(selectedGroupId, {
        enabled: Boolean(selectedGroupId),
        keepPreviousData: true,
    });

    useEffect(() => {
        if (groups && !find(groups, { id: selectedGroupId })) {
            setSelectedGroupId(sortBy(groups, "name")[0]?.id);
        }
    }, [groups, selectedGroupId]);

    if (isLoadingGroups || (groups.length && !selectedGroup)) {
        return <LoadingPlaceholder className="mt-32" />;
    }

    return (
        <>
            <GroupsHeader>
                <h2>Groups</h2>
                <LinkButton color="blue" to={{ state: { createGroup: true } }}>
                    Create
                </LinkButton>
            </GroupsHeader>

            {groups.length ? (
                <ManageGroupsContainer>
                    <GroupSelector
                        groups={groups}
                        selectedGroup={selectedGroupId}
                        setSelectedGroup={setSelectedGroupId}
                    />
                    <div>
                        <InputHeader
                            id="name"
                            value={selectedGroup.name}
                            onSubmit={name => updateGroupMutation.mutate({ id: selectedGroup.id, name })}
                        />
                        <Permissions selectedGroup={selectedGroup} />
                        <Members members={selectedGroup.users} />
                        <RemoveBanner
                            message="Permanently delete this group."
                            buttonText="Delete"
                            onClick={() => removeMutation.mutate({ id: selectedGroup.id })}
                        />
                    </div>
                </ManageGroupsContainer>
            ) : (
                <NoneSelectedContainer>
                    <NoneSelected>No Groups Found</NoneSelected>
                </NoneSelectedContainer>
            )}

            <Create />
        </>
    );
}
