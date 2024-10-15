import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { InputSearch, LinkButton, Toolbar } from "@base";
import { Permission } from "@groups/types";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";

/**
 * A toolbar which allows the references to be filtered by name
 */
export default function ReferenceToolbar() {
    const [term, setTerm] = useUrlSearchParam("find", "");
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(Permission.create_ref);

    return (
        <Toolbar>
            <InputSearch placeholder="Reference name" value={term} onChange={e => setTerm(e.target.value)} />
            {canCreate && (
                <LinkButton to="?createReference=true&createReferenceType=empty" color="blue">
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}
