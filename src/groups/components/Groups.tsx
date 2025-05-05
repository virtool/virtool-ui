import { find, sortBy } from "lodash-es";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDialogParam } from "../../app/hooks";
import { getColor } from "../../app/theme";
import BoxGroup from "../../base/BoxGroup";
import Button from "../../base/Button";
import InputHeader from "../../base/InputHeader";
import LoadingPlaceholder from "../../base/LoadingPlaceholder";
import RemoveBanner from "../../base/RemoveBanner";
import {
    useFetchGroup,
    useListGroups,
    useRemoveGroup,
    useUpdateGroup,
} from "../queries";
import Create from "./CreateGroup";
import { GroupMembers } from "./GroupMembers";
import { GroupPermissions } from "./GroupPermissions";
import { GroupSelector } from "./GroupSelector";

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
    background-color: ${(props) =>
        getColor({ theme: props.theme, color: "greyLightest" })};
    flex: 1 1 auto;
    height: 300px;
`;

export const NoneSelected = styled.div`
    color: ${(props) => props.theme.color.greyDarkest};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export default function Groups() {
    const updateGroupMutation = useUpdateGroup();
    const removeMutation = useRemoveGroup();

    const { setOpen: setOpenCreateGroup } = useDialogParam("openCreateGroup");
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const { data: groups, isPending: isPendingGroups } = useListGroups();
    const { data: selectedGroup } = useFetchGroup(selectedGroupId);

    useEffect(() => {
        if (groups && !find(groups, { id: selectedGroupId })) {
            setSelectedGroupId(sortBy(groups, "name")[0]?.id);
        }
    }, [groups, selectedGroupId]);

    if (isPendingGroups || (groups.length && !selectedGroup)) {
        return <LoadingPlaceholder className="mt-32" />;
    }

    return (
        <>
            <GroupsHeader>
                <h2>Groups</h2>
                <Button color="blue" onClick={() => setOpenCreateGroup(true)}>
                    Create
                </Button>
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
                            onSubmit={(name) =>
                                updateGroupMutation.mutate({
                                    id: selectedGroup.id,
                                    name,
                                })
                            }
                        />
                        <GroupPermissions selectedGroup={selectedGroup} />
                        <GroupMembers members={selectedGroup.users} />
                        <RemoveBanner
                            message="Permanently delete this group."
                            buttonText="Delete"
                            onClick={() =>
                                removeMutation.mutate({ id: selectedGroup.id })
                            }
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
