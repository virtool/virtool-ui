import { debounce } from "lodash-es";
import React, { useState } from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { pushState } from "../../app/actions";
import { Icon, InputSearch, LinkButton, Toolbar } from "../../base";
import { clearSampleSelection, updateSearch } from "../actions";
import { getTermFromURL } from "../selectors";
import { SampleSelectionToolbar } from "./SelectionToolbar";

export const SampleSearchToolbar = ({ canCreate, initialTerm, onFind }) => {
    const [term, setTerm] = useState(initialTerm);

    const handleChange = e => {
        const value = e.target.value;
        setTerm(value);
        onFind(value);
    };

    let createButton;

    if (canCreate) {
        createButton = (
            <LinkButton to="/samples/create" color="blue" tip="Create">
                <Icon name="plus-square fa-fw" />
            </LinkButton>
        );
    }

    return (
        <Toolbar>
            <InputSearch value={term} onChange={handleChange} placeholder="Sample name" />
            {createButton}
        </Toolbar>
    );
};

const SampleToolbar = props => {
    if (props.selected.length) {
        return <SampleSelectionToolbar {...props} />;
    }

    return <SampleSearchToolbar {...props} />;
};

const mapStateToProps = state => ({
    canCreate: checkAdminRoleOrPermission(state, "create_sample"),
    initialTerm: getTermFromURL(state),
    selected: state.samples.selected
});

const mapDispatchToProps = dispatch => ({
    onClear: () => {
        dispatch(clearSampleSelection());
    },

    onFind: debounce(term => {
        dispatch(updateSearch({ term }));
    }, 150),

    onQuickAnalyze: () => {
        dispatch(pushState({ quickAnalysis: true }));
    },

    onSelect: sampleId => {
        dispatch(toggleSelectSample(sampleId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SampleToolbar);
