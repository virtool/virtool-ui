import { useDialogParam } from "@app/hooks";
import Button from "@base/Button";
import InputHeader from "@base/InputHeader";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import RemoveBanner from "@base/RemoveBanner";
import { sortBy } from "es-toolkit/compat";
import { useState } from "react";
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

export default function Groups() {
    const updateGroupMutation = useUpdateGroup();
    const removeMutation = useRemoveGroup();

    const { setOpen: setOpenCreateGroup } = useDialogParam("openCreateGroup");
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [prevGroups, setPrevGroups] = useState(null);

    const { data: groups, isPending: isPendingGroups } = useListGroups();

    if (groups !== prevGroups) {
        setPrevGroups(groups);
        if (groups && !groups.find((g) => g.id === selectedGroupId)) {
            setSelectedGroupId(sortBy(groups, (g) => g.name)[0]?.id);
        }
    }

    const { data: selectedGroup } = useFetchGroup(selectedGroupId);

    if (isPendingGroups || (groups.length && !selectedGroup)) {
        return <LoadingPlaceholder className="mt-32" />;
    }

    return (
        <>
            <header className="flex items-center justify-between mb-5">
                <h2>Groups</h2>
                <Button color="blue" onClick={() => setOpenCreateGroup(true)}>
                    Create
                </Button>
            </header>

            {groups.length ? (
                <div className="gap-x-4 grid grid-cols-4">
                    <GroupSelector
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        setSelectedGroupId={setSelectedGroupId}
                    />
                    <div className="col-span-3">
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
                            outerClassName="!mb-0"
                            message="Permanently delete this group."
                            buttonText="Delete"
                            onClick={() =>
                                removeMutation.mutate({ id: selectedGroup.id })
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-gray-200 flex items-center h-48 justify-center rounded-md text-gray-600">
                    No Groups Exist
                </div>
            )}

            <Create />
        </>
    );
}
