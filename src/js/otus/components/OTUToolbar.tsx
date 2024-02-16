import React, { ChangeEvent } from "react";
import { InputSearch, LinkButton, Toolbar } from "../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../references/hooks";
import { ReferenceRemotesFrom } from "../../references/types";

type OTUToolbarProps = {
    /** Current search term used for filtering */
    term: string;
    /** A callback function to handle changes in search input */
    onChange: (term: ChangeEvent<HTMLInputElement>) => void;
    refId: string;
    /** Whether the reference is installed remotely */
    remotesFrom: ReferenceRemotesFrom | null;
};

/**
 * A toolbar which allows the OTUs to be filtered by their names
 */
export default function OTUToolbar({ term, onChange, refId, remotesFrom }: OTUToolbarProps) {
    const { hasPermission: canCreate } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);

    return (
        <Toolbar>
            <InputSearch placeholder="Name or abbreviation" value={term} onChange={onChange} />

            {canCreate && !remotesFrom && (
                <LinkButton to={{ state: { createOTU: true } }} color="blue" replace>
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}
