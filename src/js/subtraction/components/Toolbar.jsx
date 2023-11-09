import React from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";
import { findSubtractions } from "../actions";

/**
 * Managing the toolbar search filtering
 *
 * @param onFind - The dispatch action to update the search filtering results
 * @param canModify - The user's permissions to modify
 * @returns Toolbar - A search filtering toolbar
 */
export const SubtractionToolbar = ({ onFind, canModify }) => {
    const [term, setTerm] = useUrlSearchParams("find");

    const onChange = e => {
        const searchValue = e.target.value;
        setTerm(searchValue);
        onFind(searchValue);
    };

    let createButton;
    if (canModify) {
        createButton = (
            <LinkButton color="blue" to="subtractions/create" icon="plus-square" tip="Create" aria-label="create" />
        );
    }

    return (
        <Toolbar>
            <InputSearch value={term} onChange={onChange} placeholder="Name" />
            {createButton}
        </Toolbar>
    );
};

export const mapStateToProps = state => ({
    canModify: checkAdminRoleOrPermission(state, "modify_subtraction"),
});

export const mapDispatchToProps = dispatch => ({
    onFind: term => {
        dispatch(findSubtractions(term, 1));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionToolbar);
