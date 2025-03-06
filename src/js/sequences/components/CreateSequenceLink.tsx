import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { formatSearchParams } from "@/hooks";
import { cn } from "@/utils";
import React from "react";
import { Link } from "wouter";

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

    if (canModify) {
        return (
            <Link
                className={cn("ml-auto", "cursor-pointer")}
                to={formatSearchParams({ openCreateSequence: true })}
            >
                Create Sequence
            </Link>
        );
    }

    return null;
}
