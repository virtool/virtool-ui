import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { pushState } from "../../app/actions";
import { BoxGroup, Button, LoadingPlaceholder } from "../../base";
import { listGroups, removeGroup } from "../actions";
import { getActiveGroup, getGroups } from "../selectors";
import Create from "./Create";
import GroupSelector from "./GroupSelector";
import Members from "./Members";
import Permissions from "./Permissions";

const ManageGroupsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 15px;
`;

const StyledGroupsHeader = styled.div`
    display: flex;
    padding-bottom: 5px;
    button {
        height: 50%;
        margin-top: 25%;
        margin-left: 15px;
    }
`;

const StyledGroupsButton = styled(Button)`
    margin-top: 5px;
`;

const StyledNoneFoundContainer = styled(BoxGroup)`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.color.greyLightest};
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

export const Groups = ({ loading, groups, activeGroup, onShowCreateGroup, onRemove, onListGroups }) => {
    useEffect(() => {
        onListGroups();
    }, []);

    if (loading) {
        return <LoadingPlaceholder margin="130px" />;
    }

    let groupComponents;

    if (groups.length) {
        groupComponents = (
            <>
                <ManageGroupsContainer>
                    <GroupSelector />
                    <Permissions />
                    <Members />
                </ManageGroupsContainer>

                <StyledGroupsButton icon="trash" color="red" onClick={() => onRemove(activeGroup.id)}>
                    Remove Group
                </StyledGroupsButton>
            </>
        );
    } else {
        groupComponents = (
            <StyledNoneFoundContainer>
                <NoneSelected>No Groups Found</NoneSelected>
            </StyledNoneFoundContainer>
        );
    }

    return (
        <>
            <StyledGroupsHeader>
                <h2>Manage Groups</h2>
                <Button icon="user-plus" tip="Create" color="blue" onClick={onShowCreateGroup} />
            </StyledGroupsHeader>

            {groupComponents}

            <Create />
        </>
    );
};

const mapStateToProps = state => {
    const groups = getGroups(state);
    const activeGroup = getActiveGroup(state);

    return {
        activeGroup,
        groups,
        loading: !groups || !activeGroup
    };
};

const mapDispatchToProps = dispatch => ({
    onListGroups: () => {
        dispatch(listGroups());
    },
    onRemove: groupId => {
        dispatch(removeGroup(groupId));
    },
    onShowCreateGroup: () => dispatch(pushState({ createGroup: true }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
