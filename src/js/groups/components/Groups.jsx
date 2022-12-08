import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { BoxGroup, LinkButton, LoadingPlaceholder, RemoveBanner } from "../../base";
import { listGroups, removeGroup, setGroupName } from "../actions";
import { getActiveGroup, getGroups } from "../selectors";
import { findUsers } from "../../users/actions";
import Create from "./Create";
import GroupSelector from "./GroupSelector";
import Members from "./Members";
import Permissions from "./Permissions";
import { getColor } from "../../app/theme";
import { InputHeader } from "../../base/InputHeader";

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

export const Groups = ({ activeGroup, groups, loading, onFindUsers, onListGroups, onRemove, onSetName }) => {
    useEffect(() => {
        onListGroups();
        onFindUsers();
    }, []);

    if (loading) {
        return <LoadingPlaceholder margin="130px" />;
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
                    <GroupSelector />
                    <div>
                        <InputHeader
                            id="name"
                            value={activeGroup.name}
                            onSubmit={name => onSetName(activeGroup.id, name)}
                        />
                        <Permissions />
                        <Members />
                        <RemoveBanner
                            message="Permanently delete this group."
                            buttonText="Delete"
                            onClick={() => onRemove(activeGroup.id)}
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
};

const mapStateToProps = state => {
    const groups = getGroups(state);
    const activeGroup = getActiveGroup(state);
    return {
        activeGroup: activeGroup || {},
        groups,
        loading: !groups || (!activeGroup && groups.length !== 0)
    };
};

const mapDispatchToProps = dispatch => ({
    onFindUsers: () => {
        dispatch(findUsers());
    },
    onListGroups: () => {
        dispatch(listGroups());
    },
    onRemove: groupId => {
        dispatch(removeGroup(groupId));
    },
    onSetName: (groupId, name) => {
        dispatch(setGroupName(groupId, name));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
