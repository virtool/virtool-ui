import { Icon } from "@base";
import { useCurrentOTUContext } from "@otus/queries";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { ReferenceDataType } from "@references/types";
import { useGetUnreferencedTargets } from "@sequences/hooks";
import React from "react";
import { formatSearchParams } from "@utils/hooks";
import { Link } from "wouter";
import { cn } from "@utils/utils";

type AddSequenceLinkProps = {
    dataType: ReferenceDataType;
    refId: string;
};

/**
 * Displays a link to add a sequence
 */
export default function AddSequenceLink({ dataType, refId }: AddSequenceLinkProps) {
    const { reference } = useCurrentOTUContext();
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);
    const unreferencedTargets = useGetUnreferencedTargets();
    const hasUnreferencedTargets = Boolean(unreferencedTargets?.length);
    const hasTargets = Boolean(reference.targets?.length);

    if (canModify) {
        if (dataType === "barcode") {
            if (!hasTargets) return null;

            if (!hasUnreferencedTargets) {
                return (
                    <span color="green" className={cn("ml-auto", "text-green-600")}>
                        <Icon name="check-double" /> All targets defined
                    </span>
                );
            }
        }

        return (
            <Link className={cn("ml-auto", "cursor-pointer")} to={formatSearchParams({ openAddSequence: true })}>
                Add Sequence
            </Link>
        );
    }

    return null;
}
