import { useUrlSearchParam } from "../../app/hooks";
import { cn } from "../../app/utils";
import { ReferenceRight, useCheckReferenceRight } from "../../references/hooks";
import React from "react";

type CreateSequenceLinkProps = {
    refId: string;
};

/**
 * Displays a link to add a sequence
 */
export default function CreateSequenceLink({ refId }: CreateSequenceLinkProps) {
    const { hasPermission: canModify } = useCheckReferenceRight(
        refId,
        ReferenceRight.modify_otu,
    );
    const { setValue: setOpenCreateSequence } =
        useUrlSearchParam("openCreateSequence");

    if (canModify) {
        return (
            <a
                className={cn("ml-auto", "cursor-pointer")}
                onClick={() => setOpenCreateSequence(true)}
            >
                Create Sequence
            </a>
        );
    }

    return null;
}
