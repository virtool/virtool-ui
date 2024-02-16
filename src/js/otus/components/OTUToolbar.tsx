import React, { ChangeEvent } from "react";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../references/hooks";

type OTUToolbarProps = {
    /** Current search term used for filtering */
    term: string;
    /** A callback function to handle changes in search input */
    onChange: (term: ChangeEvent<HTMLInputElement>) => void;
    refId: string;
};

/**
 * A toolbar which allows the OTUs to be filtered by their names
 */
export default function OTUToolbar({ term, onChange, refId }: OTUToolbarProps) {
    const { hasPermission: canCreate } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);

    return (
        <Toolbar>
            <InputSearch placeholder="Name or abbreviation" value={term} onChange={onChange} />

            {canCreate && (
                <LinkButton to={{ state: { createOTU: true } }} color="blue" replace>
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}
