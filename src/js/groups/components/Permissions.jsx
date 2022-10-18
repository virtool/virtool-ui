import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { setGroupPermission } from "../actions";
import { getActiveGroup } from "../selectors";
import { GroupComponentsContainer } from "./GroupSelector";
import { GroupPermission } from "./Permission";

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
        <div>
            <label>Permissions</label>
            <GroupComponentsContainer>{permissionComponents}</GroupComponentsContainer>
        </div>
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
