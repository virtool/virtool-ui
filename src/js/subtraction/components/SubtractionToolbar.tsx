import CreateSubtraction from "@subtraction/components/CreateSubtraction";
import React from "react";
import { useCheckAdminRoleOrPermission } from "../../administration/hooks";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { Permission } from "../../groups/types";

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

    return (
        <Toolbar>
            <InputSearch value={term} onChange={handleChange} placeholder="Name" />
            {hasPermission && (
                <LinkButton color="blue" to={{ state: { createSubtraction: true } }}>
                    Create
                </LinkButton>
            )}
            <CreateSubtraction />
        </Toolbar>
    );
}
