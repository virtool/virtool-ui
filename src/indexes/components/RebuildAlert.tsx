import { usePageParam } from "@app/hooks";
import Alert from "@base/Alert";
import Icon from "@base/Icon";
import Link from "@base/Link";
import React from "react";
import { ReferenceRight, useCheckReferenceRight } from "../../references/hooks";
import { useFindIndexes } from "../queries";

type RebuildAlertProps = {
    refId: string;
};

/**
 * An alert that appears when the reference has unbuilt changes.
 */
export default function RebuildAlert({ refId }: RebuildAlertProps) {
    const { page } = usePageParam();
    const { data, isPending } = useFindIndexes(page, 25, refId);
    const { hasPermission: hasRights } = useCheckReferenceRight(
        refId,
        ReferenceRight.build,
    );

    if (isPending) {
        return null;
    }

    const { total_otu_count, change_count } = data;

    if (total_otu_count === 0 && hasRights) {
        return (
            <Alert color="orange" level>
                <Icon name="exclamation-circle" />
                <strong>
                    At least one OTU must be added to the database before an
                    index can be built.
                </strong>
            </Alert>
        );
    }

    if (change_count && hasRights) {
        return (
            <Alert color="orange" level>
                <Icon name="info-circle" />
                <span>
                    <span>There are unbuilt changes. </span>
                    <Link to={`/refs/${refId}/indexes?openRebuild=true`}>
                        Rebuild the index
                    </Link>
                    <span> to use the changes in future analyses.</span>
                </span>
            </Alert>
        );
    }

    return null;
}
