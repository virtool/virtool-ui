import React from "react";
import { useCheckAdminRoleOrPermission } from "../../administration/hooks";
import { formatSearchParams, useUrlSearchParam } from "../../app/hooks";
import InputSearch from "../../base/InputSearch";
import LinkButton from "../../base/LinkButton";
import Toolbar from "../../base/Toolbar";
import { Permission } from "../../groups/types";

/**
 * A toolbar which allows the references to be filtered by name
 */
export default function ReferenceToolbar() {
    const { value: term, setValue: setTerm } =
        useUrlSearchParam<string>("find");
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(
        Permission.create_ref,
    );

    return (
        <Toolbar>
            <div className="flex-grow">
                <InputSearch
                    placeholder="Reference name"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
            </div>
            {canCreate && (
                <LinkButton
                    to={formatSearchParams({ createReferenceType: "empty" })}
                    color="blue"
                >
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}
