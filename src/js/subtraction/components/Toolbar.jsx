import React from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";
import { findSubtractions } from "../actions";

export const SubtractionToolbar = ({ onFind, canModify }) => {
    const { value: term, setValue: setTerm } = useUrlSearchParams({
        key: "find",
    });
    const handleSubmit = e => {
        const value = e.target.value;
        setTerm(value);
        onFind(value);
    };
    let createButton;
    if (canModify) {
        createButton = <LinkButton color="blue" to="subtractions/create" icon="plus-square" tip="Create" />;
    }

    return (
        <Toolbar>
            <InputSearch value={term} onChange={handleSubmit} placeholder="Name" />
            {createButton}
        </Toolbar>
    );
};

export const mapStateToProps = state => ({
    canModify: checkAdminRoleOrPermission(state, "modify_subtraction"),
});

export const mapDispatchToProps = dispatch => ({
    onFind: term => {
        dispatch(findSubtractions(term));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionToolbar);
