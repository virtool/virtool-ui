import { capitalize, map } from "lodash-es";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { InputGroup, InputLabel, InputSelect } from "../../base";
import { editUser } from "../actions";

export const PrimaryGroupOption = styled.option`
    text-transform: capitalize;
`;

export const PrimaryGroup = ({ groups, id, primaryGroup, onSetPrimaryGroup }) => {
    const handleSetPrimaryGroup = useCallback(
        e => onSetPrimaryGroup(id, e.target.value === "none" ? null : e.target.value),
        [id, primaryGroup],
    );

    const groupOptions = map(groups, ({ id, name }) => (
        <PrimaryGroupOption key={id} value={id}>
            {capitalize(name)}
        </PrimaryGroupOption>
    ));

    return (
        <InputGroup>
            <InputLabel>Primary Group</InputLabel>
            <InputSelect value={primaryGroup?.id || "none"} onChange={handleSetPrimaryGroup}>
                <option key="none" value="none">
                    None
                </option>
                {groupOptions}
            </InputSelect>
        </InputGroup>
    );
};

export const mapStateToProps = state => {
    const { groups, id, primary_group } = state.users.detail;

    return {
        groups,
        id,
        primaryGroup: primary_group,
    };
};

export const mapDispatchToProps = dispatch => ({
    onSetPrimaryGroup: (userId, groupId) => {
        dispatch(editUser(userId, { primary_group: groupId }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryGroup);
