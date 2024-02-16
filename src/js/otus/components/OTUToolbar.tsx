import React, { ChangeEvent } from "react";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { useCanModifyReferenceOTU } from "../../references/hooks";
import { Reference } from "../../references/types";

type OTUToolbarProps = {
    /** Current search term used for filtering */
    term: string;
    /** A callback function to handle changes in search input */
    onChange: (term: ChangeEvent<HTMLInputElement>) => void;
    /** Whether the reference is installed remotely */
    reference: Reference;
};

/**
 * A toolbar which allows the OTUs to be filtered by their names
 */
export default function OTUToolbar({ term, onChange, reference }: OTUToolbarProps) {
    const canCreate = useCanModifyReferenceOTU(reference);

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
