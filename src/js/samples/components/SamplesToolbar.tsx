import React from "react";
import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { InputSearch, LinkButton } from "@base";
import Toolbar from "@base/Toolbar";
import { Permission } from "@groups/types";
import { SampleSelectionToolbar } from "./SampleSelectionToolbar";

function SampleSearchToolbar({ onChange, term }) {
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(
        Permission.create_sample,
    );

    return (
        <Toolbar>
            <div className="flex-grow">
                <InputSearch
                    value={term || ""}
                    onChange={onChange}
                    placeholder="Sample name"
                />
            </div>
            {canCreate && (
                <LinkButton color="blue" to="/samples/create">
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}

/**
 * A toolbar allowing samples to be filtered by name and to create an analysis for selected samples
 */
export default function SampleToolbar({ selected, onClear, onChange, term }) {
    return selected.length ? (
        <SampleSelectionToolbar selected={selected} onClear={onClear} />
    ) : (
        <SampleSearchToolbar onChange={onChange} term={term} />
    );
}
