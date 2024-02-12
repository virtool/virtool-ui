import { find, includes, map } from "lodash-es";
import React from "react";
import { useQueryClient } from "react-query";
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

export default function SampleRights({ match }) {
    const { sampleId } = match.params;

    const { hasPermission: canModifyRights } = useCheckAdminRole(AdministratorRoles.FULL);
    const { data: sample, isLoading: isLoadingSample } = useFetchSample(sampleId);
    const { data: groups, isLoading: isLoadingGroups } = useListGroups();
    const queryClient = useQueryClient();

    const mutation = useUpdateSampleRights(sampleId);

    if (isLoadingSample || isLoadingGroups) {
        return <LoadingPlaceholder />;
    }

    const { group, group_read, group_write, all_read, all_write } = sample;

    function handleChangeGroup(e) {
        mutation.mutate(
            { update: { group: e.target.value } },
            {
                onSuccess: data => {
                    console.log(data);

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
                onSuccess: data => {
                    console.log(data);
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
                        <InputLabel>Group</InputLabel>
                        <InputSelect value={selectedGroup} onChange={handleChangeGroup}>
                            <option value="none">None</option>
                            {groupOptionComponents}
                        </InputSelect>
                    </InputGroup>

                    <InputGroup>
                        <InputLabel>Group Rights</InputLabel>
                        <InputSelect
                            name="groupRights"
                            value={groupRights}
                            onChange={e => handleChangeRights(e, "group")}
                        >
                            <option value="">None</option>
                            <option value="r">Read</option>
                            <option value="rw">Read & write</option>
                        </InputSelect>
                    </InputGroup>

                    <InputGroup>
                        <InputLabel>All Users' Rights</InputLabel>
                        <InputSelect name="allUsers" value={allRights} onChange={e => handleChangeRights(e, "all")}>
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
