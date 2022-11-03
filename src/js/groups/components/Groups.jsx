import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { pushState } from "../../app/actions";
import { BoxGroup, Button, LoadingPlaceholder, RemoveBanner, BoxGroupHeader } from "../../base";
import { listGroups, removeGroup } from "../actions";
import { getActiveGroup, getGroups } from "../selectors";
import { findUsers } from "../../users/actions";
import Create from "./Create";
import GroupSelector from "./GroupSelector";
import Members from "./Members";
import Permissions from "./Permissions";
import { getColor } from "../../app/theme";

const ManageGroupsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 15px;
`;

const StyledGroupsHeader = styled.div`
    display: flex;
    padding-bottom: 5px;
    justify-content: space-between;
    button {
        margin-left: 15px;
        height: 36px;
    }
`;

const StyledNoneFoundContainer = styled(BoxGroup)`
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

export const Groups = ({ loading, groups, activeGroup, onShowCreateGroup, onRemove, onListGroups, onFindUsers }) => {
    useEffect(() => {
        onListGroups();
        onFindUsers();
    }, []);

    if (loading) {
        return <LoadingPlaceholder margin="130px" />;
    }

    let groupComponents;

    if (groups.length) {
        groupComponents = (
            <ManageGroupsContainer>
                <GroupSelector />
                <div>
                    <BoxGroup>
                        <BoxGroupHeader>
                            <h2>{activeGroup.id}</h2>
                        </BoxGroupHeader>
                    </BoxGroup>

                    <Permissions />
                    <Members />
                    <RemoveBanner
                        message={`Permanently delete ${activeGroup.id}`}
                        buttonText="Delete"
                        onClick={() => onRemove(activeGroup.id)}
                    />
                </div>
            </ManageGroupsContainer>
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
            <h2>Manage Groups</h2>
            <StyledGroupsHeader>
                <h3>Use groups to organize users and control access</h3>

                <Button tip="Create" color="blue" onClick={onShowCreateGroup}>
                    Create
                </Button>
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
        activeGroup: activeGroup || {},
        groups,
        loading: !groups || (!activeGroup && groups.length !== 0)
    };
};

const mapDispatchToProps = dispatch => ({
    onListGroups: () => {
        dispatch(listGroups());
    },
    onFindUsers: () => {
        dispatch(findUsers());
    },
    onRemove: groupId => {
        dispatch(removeGroup(groupId));
    },
    onShowCreateGroup: () => dispatch(pushState({ createGroup: true }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
