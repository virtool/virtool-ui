import React from "react";
import { useHistory } from "react-router-dom";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { Icon, InputSearch, LinkButton, Toolbar } from "../../base";
import { SampleSelectionToolbar } from "./SelectionToolbar";

export function SampleSearchToolbar({ onChange, term }) {
    const { hasPermission: canCreate } = useCheckAdminRole(AdministratorRoles.USERS);

    return (
        <Toolbar>
            <InputSearch value={term} onChange={onChange} placeholder="Sample name" />
            {canCreate && (
                <LinkButton icon="create" to="/samples/create" color="blue" tip="Create">
                    <Icon name="plus-square fa-fw" />
                </LinkButton>
            )}
        </Toolbar>
    );
}

export default function SampleToolbar({ selected, onClear, onChange, term }) {
    const history = useHistory();
    function onQuickAnalyze() {
        history.push({ state: { quickAnalysis: true } });
    }

    if (selected.length) {
        return <SampleSelectionToolbar selected={selected} onQuickAnalyze={onQuickAnalyze} onClear={onClear} />;
    }

    return <SampleSearchToolbar onChange={onChange} term={term} />;
}
