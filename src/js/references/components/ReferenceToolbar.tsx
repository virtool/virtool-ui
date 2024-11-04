import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { InputSearch, LinkButton, Toolbar } from "@base";
import { Permission } from "@groups/types";
import { formatSearchParams, useUrlSearchParam } from "@utils/hooks";
import React from "react";

/**
 * A toolbar which allows the references to be filtered by name
 */
export default function ReferenceToolbar() {
    const { value: term, setValue: setTerm } = useUrlSearchParam<string>("find");
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(Permission.create_ref);

    return (
        <Toolbar>
            <InputSearch placeholder="Reference name" value={term} onChange={e => setTerm(e.target.value)} />
            {canCreate && (
                <LinkButton to={formatSearchParams({ createReferenceType: "empty" })} color="blue">
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}
