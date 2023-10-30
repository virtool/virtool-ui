import React from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { InputSearch, LinkButton, Toolbar } from "../../base";

/**
 * Managing the toolbar search filtering
 *
 * @param onFind - The dispatch action to update the search filtering results
 * @param canModify - The user's permissions to modify
 * @returns Toolbar - A search filtering toolbar
 */
export const SubtractionToolbar = ({ term, onChange, canModify }) => {
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

export default connect(mapStateToProps, null)(SubtractionToolbar);
