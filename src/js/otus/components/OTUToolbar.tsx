import { formatSearchParams } from "@/hooks";
import InputSearch from '@base/InputSearch';
import LinkButton from '@base/LinkButton';
import Toolbar from "@base/Toolbar";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { ReferenceRemotesFrom } from "@references/types";
import React, { ChangeEvent } from "react";

type OtuToolbarProps = {
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
export default function OTUToolbar({
    term,
    onChange,
    refId,
    remotesFrom,
}: OtuToolbarProps) {
    const { hasPermission: canCreate } = useCheckReferenceRight(
        refId,
        ReferenceRight.modify_otu,
    );

    return (
        <Toolbar>
            <div className="flex-grow">
                <InputSearch
                    placeholder="Name or abbreviation"
                    value={term}
                    onChange={onChange}
                />
            </div>

            {canCreate && !remotesFrom && (
                <LinkButton
                    to={formatSearchParams({ openCreateOTU: true })}
                    color="blue"
                >
                    Create
                </LinkButton>
            )}
        </Toolbar>
    );
}
