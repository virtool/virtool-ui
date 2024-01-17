import React, { ChangeEvent } from "react";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { InputSearch, LinkButton, Toolbar } from "../../base";

type AnalysesToolbarProps = {
    /** A callback function to handle changes in search input */
    onChange: (term: ChangeEvent<HTMLInputElement>) => void;
    /** The sample id to be used to push the create analysis dialog onto */
    sampleId: string;
    /** Current search term used for filtering */
    term: string;
};

/**
 * A toolbar which allows the analyses to be filtered by their names
 */
export default function AnalysesToolbar({ onChange, sampleId, term }: AnalysesToolbarProps) {
    const { hasPermission: canCreate } = useCheckAdminRole(AdministratorRoles.USERS);

    return (
        <Toolbar>
            <InputSearch value={term} onChange={onChange} />
            {canCreate && (
                <LinkButton
                    icon="plus-square fa-fw"
                    to={{ state: { createAnalysis: sampleId } }}
                    color="blue"
                    tip="New Analysis"
                />
            )}
        </Toolbar>
    );
}
