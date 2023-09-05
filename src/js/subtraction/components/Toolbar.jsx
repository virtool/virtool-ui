import React from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { findSubtractions } from "../actions";

export const SubtractionToolbar = ({ term, onFind, canModify }) => {
    let createButton;

    if (canModify) {
        createButton = <LinkButton color="blue" to="subtractions/create" icon="plus-square" tip="Create" />;
    }

    return (
        <Toolbar>
            <InputSearch value={term} onChange={onFind} placeholder="Name" />
            {createButton}
        </Toolbar>
    );
};

export const mapStateToProps = state => ({
    term: state.subtraction.term || "",
    canModify: checkAdminRoleOrPermission(state, "modify_subtraction"),
});

export const mapDispatchToProps = dispatch => ({
    onFind: e => {
        dispatch(findSubtractions(e.target.value || null, 1));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionToolbar);
