import React from "react";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { SampleSelectionToolbar } from "./SelectionToolbar";

export function SampleSearchToolbar({ onChange, term }) {
    const { hasPermission: canCreate } = useCheckAdminRole(AdministratorRoles.USERS);

    return (
        <Toolbar>
            <InputSearch value={term} onChange={onChange} placeholder="Sample name" />
            {canCreate && <LinkButton icon="plus-square fa-fw" to="/samples/create" color="blue" tip="Create" />}
        </Toolbar>
    );
}

export default function SampleToolbar({ selected, onClear, onChange, term }) {
    return selected.length ? (
        <SampleSelectionToolbar selected={selected} onClear={onClear} />
    ) : (
        <SampleSearchToolbar onChange={onChange} term={term} />
    );
}