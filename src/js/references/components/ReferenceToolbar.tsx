import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { InputSearch, LinkButton, Toolbar } from "@base";
import { Permission } from "@groups/types";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";

/**
 * A toolbar which allows the references to be filtered by name
 */
export default function ReferenceToolbar() {
    const [term, setTerm] = useUrlSearchParams<string>("find", "");
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(Permission.create_ref);

    const createButton = canCreate ? (
        <LinkButton
            to={{ state: { createReference: true, emptyReference: true } }}
            color="blue"
            tip="Create"
            icon="plus-square fa-fw"
        />
    ) : null;

    return (
        <Toolbar>
            <InputSearch placeholder="Reference name" value={term} onChange={e => setTerm(e.target.value)} />
            {createButton}
        </Toolbar>
    );
}
