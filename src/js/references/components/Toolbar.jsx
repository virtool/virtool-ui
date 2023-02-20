import React from "react";
import { connect } from "react-redux";
import { Icon, LinkButton, InputSearch, Toolbar } from "../../base";
import { checkAdminOrPermission } from "../../utils/utils";
import { findReferences } from "../actions";

export const ReferenceToolbar = ({ term, onFind, canCreate }) => {
    let createButton;

    if (canCreate) {
        createButton = (
            <LinkButton
                to={{ pathname: "/refs/add", state: { newReference: true, emptyReference: true } }}
                color="blue"
                tip="Create"
            >
                <Icon name="plus-square fa-fw" />
            </LinkButton>
        );
    }

    return (
        <Toolbar>
            <InputSearch placeholder="Reference name" value={term} onChange={onFind} />
            {createButton}
        </Toolbar>
    );
};

const mapStateToProps = state => ({
    canCreate: checkAdminOrPermission(state, "create_ref"),
    term: state.references.term
});

const mapDispatchToProps = dispatch => ({
    onFind: e => {
        dispatch(findReferences(e.target.value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceToolbar);
