import CreateSubtraction from "@subtraction/components/CreateSubtraction";
import { updateSearchParam } from "@utils/hooks";
import React from "react";
import { useSearch } from "wouter";
import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { InputSearch, LinkButton } from "@base";
import Toolbar from "@base/Toolbar";
import { Permission } from "@groups/types";

type SubtractionToolbarProps = {
    /** Current search term used for filtering */
    term: string;

    /** A callback function to handle changes in search input */
    handleChange: (any) => void;
};

/**
 * A search filtering toolbar
 */
export default function SubtractionToolbar({ term, handleChange }: SubtractionToolbarProps) {
    const { hasPermission } = useCheckAdminRoleOrPermission(Permission.modify_subtraction);
    const search = useSearch();

    return (
        <Toolbar>
            <div className="flex-grow">
                <InputSearch value={term} onChange={handleChange} placeholder="Name" />
            </div>
            {hasPermission && (
                <LinkButton color="blue" to={updateSearchParam("openCreateSubtraction", "true", search)}>
                    Create
                </LinkButton>
            )}
            <CreateSubtraction />
        </Toolbar>
    );
}
