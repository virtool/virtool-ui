import { useFetchAccount } from "@account/queries";
import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoleName } from "@administration/types";
import { usePathParams } from "@app/hooks";
import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import ContainerNarrow from "@base/ContainerNarrow";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSelect from "@base/InputSelect";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useListGroups } from "@groups/queries";
import {
    samplesQueryKeys,
    useFetchSample,
    useUpdateSampleRights,
} from "@samples/queries";
import { useQueryClient } from "@tanstack/react-query";
import { find, includes, map } from "lodash-es";
import React from "react";

/**
 * A component managing a samples rights
 */
export default function SampleRights() {
    const { sampleId } = usePathParams<{ sampleId: string }>();

    const { hasPermission } = useCheckAdminRole(AdministratorRoleName.FULL);
    const { data: sample, isPending: isPendingSample } =
        useFetchSample(sampleId);
    const { data: account, isPending: isPendingAccount } = useFetchAccount();
    const { data: groups, isPending: isPendingGroups } = useListGroups();

    const queryClient = useQueryClient();
    const mutation = useUpdateSampleRights(sampleId);

    if (isPendingSample || isPendingGroups || isPendingAccount) {
        return <LoadingPlaceholder />;
    }

    const canModifyRights =
        sample !== null && (hasPermission || sample.user.id === account.id);

    const { group, group_read, group_write, all_read, all_write } = sample;

    function handleChangeGroup(e) {
        mutation.mutate(
            { update: { group: e.target.value } },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: samplesQueryKeys.detail(sampleId),
                    });
                },
            },
        );
    }

    function handleChangeRights(e, scope) {
        mutation.mutate(
            {
                update: {
                    [`${scope}_read`]: includes(e.target.value, "r"),
                    [`${scope}_write`]: includes(e.target.value, "w"),
                },
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: samplesQueryKeys.detail(sampleId),
                    });
                },
            },
        );
    }

    if (!canModifyRights) {
        return <Box>Not allowed</Box>;
    }

    const groupRights = (group_read ? "r" : "") + (group_write ? "w" : "");
    const allRights = (all_read ? "r" : "") + (all_write ? "w" : "");

    const groupOptionComponents = map(groups, (group) => (
        <option key={group.id} value={group.id}>
            {group.name}
        </option>
    ));

    let selectedGroup: number | null;

    if (typeof group === "number") {
        selectedGroup = group;
    } else {
        const foundGroup = find(groups, (item) => item.legacy_id === group);
        selectedGroup = foundGroup ? foundGroup.id : null;
    }

    return (
        <ContainerNarrow>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Sample Rights</h2>
                    <p>
                        Control who can read and write this sample and which
                        user group owns the sample.
                    </p>
                </BoxGroupHeader>
                <BoxGroupSection>
                    <InputGroup>
                        <InputLabel htmlFor="group">Group</InputLabel>
                        <InputSelect
                            id="group"
                            value={selectedGroup}
                            onChange={handleChangeGroup}
                        >
                            <option value="none">None</option>
                            {groupOptionComponents}
                        </InputSelect>
                    </InputGroup>

                    <InputGroup>
                        <InputLabel htmlFor="groupRights">
                            Group Rights
                        </InputLabel>
                        <InputSelect
                            id="groupRights"
                            value={groupRights}
                            onChange={(e) => handleChangeRights(e, "group")}
                        >
                            <option value="">None</option>
                            <option value="r">Read</option>
                            <option value="rw">Read & write</option>
                        </InputSelect>
                    </InputGroup>

                    <InputGroup>
                        <InputLabel htmlFor="allUsers">
                            All {"Users'"} Rights
                        </InputLabel>
                        <InputSelect
                            id="allUsers"
                            value={allRights}
                            onChange={(e) => handleChangeRights(e, "all")}
                        >
                            <option value="">None</option>
                            <option value="r">Read</option>
                            <option value="rw">Read & write</option>
                        </InputSelect>
                    </InputGroup>
                </BoxGroupSection>
            </BoxGroup>
        </ContainerNarrow>
    );
}
