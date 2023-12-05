import React from "react";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { InputSearch, LinkButton, Toolbar } from "../../base";

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
    const { hasPermission } = useCheckAdminRole(AdministratorRoles.USERS);

    let createButton;
    if (hasPermission) {
        createButton = (
            <LinkButton color="blue" to="subtractions/create" icon="plus-square" tip="Create" aria-label="create" />
        );
    }

    return (
        <Toolbar>
            <InputSearch value={term} onChange={handleChange} placeholder="Name" />
            {createButton}
        </Toolbar>
    );
}
