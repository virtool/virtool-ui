import { useCheckAdminRoleOrPermission } from "@/administration/hooks";
import { Permission } from "@/groups/types";
import { IconButton } from "@base/IconButton";
import { JobState } from "@jobs/types";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Attribution, BoxGroupSection, Icon } from "../../../base";
import { ProgressCircle } from "../../../base/ProgressCircle";
import { ReferenceMinimal } from "../../types";

const StyledReferenceItem = styled(BoxGroupSection)`
    align-items: center;
    display: grid;
    grid-template-columns: 30% 35% 30% auto;
    padding-bottom: 15px;
    padding-top: 15px;
    margin-left: auto;
    line-height: 1;

    i {
        margin-right: 4px;
    }
`;

const ReferenceLink = styled(Link)`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const ReferenceItemDataDescriptor = styled.strong`
    text-transform: capitalize;
`;

const ReferenceItemUser = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const ReferenceItemEndIcon = styled.div`
    display: flex;
    justify-content: flex-end;
`;

type ReferenceItemProps = {
    reference: ReferenceMinimal;
};

/**
 * A condensed reference item for use in a list of references
 */
export function ReferenceItem({ reference }: ReferenceItemProps) {
    const history = useHistory();
    const { id, data_type, name, organism, user, created_at, task } = reference;
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(Permission.create_ref);

    const cloneButton = canCreate ? (
        <IconButton
            name="clone"
            tip="Clone"
            color="blue"
            onClick={() => history.push({ state: { cloneReference: id } })}
        />
    ) : null;

    return (
        <StyledReferenceItem>
            <ReferenceLink to={`/refs/${id}`}>{name}</ReferenceLink>
            <ReferenceItemDataDescriptor>
                <Icon name={data_type === "genome" ? "dna" : "barcode"} />
                {organism || "unknown"} {data_type || "genome"}s
            </ReferenceItemDataDescriptor>
            <ReferenceItemUser>
                <Attribution time={created_at} user={user.handle} />
            </ReferenceItemUser>
            <ReferenceItemEndIcon>
                {task && !task.complete ? (
                    <ProgressCircle
                        progress={task.progress || 0}
                        state={task.complete ? JobState.complete : JobState.running}
                    />
                ) : (
                    cloneButton
                )}
            </ReferenceItemEndIcon>
        </StyledReferenceItem>
    );
}
