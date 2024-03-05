import { find, includes, map } from "lodash-es";
import React from "react";
import { useQueryClient } from "react-query";
import { match } from "react-router-dom";
import { useFetchAccount } from "../../../account/querys";
import { useCheckAdminRole } from "../../../administration/hooks";
import { AdministratorRoles } from "../../../administration/types";
import {
    Box,
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    ContainerNarrow,
    InputGroup,
    InputLabel,
    InputSelect,
    LoadingPlaceholder,
} from "../../../base";
import { useListGroups } from "../../../groups/querys";
import { samplesQueryKeys, useFetchSample, useUpdateSampleRights } from "../../querys";

type SampleRightsProps = {
    /** Match object containing path information */
    match: match<{ sampleId: string }>;
};

/**
 * A component managing a samples rights
 */
export default function SampleRights({ match }: SampleRightsProps) {
    const { sampleId } = match.params;

    const { hasPermission } = useCheckAdminRole(AdministratorRoles.FULL);
    const { data: sample, isLoading: isLoadingSample } = useFetchSample(sampleId);
    const { data: account, isLoading: isLoadingAccount } = useFetchAccount();
    const { data: groups, isLoading: isLoadingGroups } = useListGroups();

    const queryClient = useQueryClient();
    const mutation = useUpdateSampleRights(sampleId);

    if (isLoadingSample || isLoadingGroups || isLoadingAccount) {
        return <LoadingPlaceholder />;
    }

    const canModifyRights = sample !== null && (hasPermission || sample.user.id === account.id);

    const { group, group_read, group_write, all_read, all_write } = sample;

    function handleChangeGroup(e) {
        mutation.mutate(
            { update: { group: e.target.value } },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(samplesQueryKeys.detail(sampleId));
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
                    queryClient.invalidateQueries(samplesQueryKeys.detail(sampleId));
                },
            },
        );
    }

    if (!canModifyRights) {
        return <Box>Not allowed</Box>;
    }

    const groupRights = (group_read ? "r" : "") + (group_write ? "w" : "");
    const allRights = (all_read ? "r" : "") + (all_write ? "w" : "");

    const groupOptionComponents = map(groups, group => (
        <option key={group.id} value={group.id}>
            {group.name}
        </option>
    ));

    const selectedGroup =
        typeof group === "number" ? group : find(groups, item => group === item.legacy_id || group === item.id)?.id;

    return (
        <ContainerNarrow>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Sample Rights</h2>
                    <p>Control who can read and write this sample and which user group owns the sample.</p>
                </BoxGroupHeader>
                <BoxGroupSection>
                    <InputGroup>
                        <InputLabel htmlFor="group">Group</InputLabel>
                        <InputSelect id="group" value={selectedGroup} onChange={handleChangeGroup}>
                            <option value="none">None</option>
                            {groupOptionComponents}
                        </InputSelect>
                    </InputGroup>

                    <InputGroup>
                        <InputLabel htmlFor="groupRights">Group Rights</InputLabel>
                        <InputSelect
                            id="groupRights"
                            value={groupRights}
                            onChange={e => handleChangeRights(e, "group")}
                        >
                            <option value="">None</option>
                            <option value="r">Read</option>
                            <option value="rw">Read & write</option>
                        </InputSelect>
                    </InputGroup>

                    <InputGroup>
                        <InputLabel htmlFor="allUsers">All Users' Rights</InputLabel>
                        <InputSelect id="allUsers" value={allRights} onChange={e => handleChangeRights(e, "all")}>
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
