import React, { ChangeEvent } from "react";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { ReferenceRemotesFrom } from "../../references/types";

type OTUToolbarProps = {
    /** Current search term used for filtering */
    term: string;
    /** A callback function to handle changes in search input */
    onChange: (term: ChangeEvent<HTMLInputElement>) => void;
    /** Whether the reference is installed remotely */
    remotesFrom: ReferenceRemotesFrom | null;
};

/**
 * A toolbar which allows the OTUs to be filtered by their names
 */
export default function OTUToolbar({
    term,
    onChange,
    remotesFrom,
}: OTUToolbarProps) {
    const { hasPermission: canCreate } = useCheckAdminRole(
        AdministratorRoles.USERS,
    );

    return (
        <Toolbar>
            <InputSearch
                placeholder="Name or abbreviation"
                value={term}
                onChange={onChange}
            />

            {canCreate && !remotesFrom && (
                <LinkButton
                    to={{ state: { createOTU: true } }}
                    color="blue"
                    replace
                >
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}
