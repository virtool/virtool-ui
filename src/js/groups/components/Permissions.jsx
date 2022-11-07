import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { setGroupPermission } from "../actions";
import { getActiveGroup } from "../selectors";
import { GroupPermission } from "./Permission";
import { GroupsHeaderContainer, GroupsInfoBoxGroupSection, SelectedGroupInfoContainer } from "./Members";

export const Permissions = ({ activeGroup, onSetPermission }) => {
    const permissionComponents = map(activeGroup.permissions, (active, permission) => (
        <GroupPermission
            key={permission}
            active={active}
            permission={permission}
            onClick={() => onSetPermission(activeGroup.id, permission, !active)}
        />
    ));

    return (
        <GroupsInfoBoxGroupSection>
            <GroupsHeaderContainer>
                <h4>Permissions</h4>
            </GroupsHeaderContainer>
            <SelectedGroupInfoContainer>{permissionComponents}</SelectedGroupInfoContainer>
        </GroupsInfoBoxGroupSection>
    );
};

const mapStateToProps = state => ({
    activeGroup: getActiveGroup(state)
});

const mapDispatchToProps = dispatch => ({
    onSetPermission: (groupId, permission, value) => {
        dispatch(setGroupPermission(groupId, permission, value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
