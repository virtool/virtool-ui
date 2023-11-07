import React from "react";
import { connect } from "react-redux";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { pushState } from "../../app/actions";
import { Icon, InputSearch, LinkButton, Toolbar } from "../../base";
import { SampleSelectionToolbar } from "./SelectionToolbar";

export function SampleSearchToolbar({ onChange, term }) {
    const { hasPermission: canCreate } = useCheckAdminRole(AdministratorRoles.USERS);
    let createButton;

    if (canCreate) {
        createButton = (
            <LinkButton icon="create" to="/samples/create" color="blue" tip="Create">
                <Icon name="plus-square fa-fw" />
            </LinkButton>
        );
    }

    return (
        <Toolbar>
            <InputSearch value={term} onChange={onChange} placeholder="Sample name" />
            {createButton}
        </Toolbar>
    );
}

function SampleToolbar({ selected, onQuickAnalyze, onClear, onChange, term }) {
    if (selected?.length) {
        return <SampleSelectionToolbar selected={selected} onQuickAnalyze={onQuickAnalyze} onClear={onClear} />;
    }

    return <SampleSearchToolbar onChange={onChange} term={term} />;
}

const mapDispatchToProps = dispatch => ({
    onQuickAnalyze: () => {
        dispatch(pushState({ quickAnalysis: true }));
    },

    onSelect: sampleId => {
        // There is something wrong with this...
        // dispatch(toggleSelectSample(sampleId));
    },
});

export default connect(null, mapDispatchToProps)(SampleToolbar);
