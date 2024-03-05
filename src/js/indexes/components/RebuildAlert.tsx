import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Icon } from "../../base";
import { checkReferenceRight } from "../../references/selectors";
import { useInfiniteFindIndexes } from "../queries";

type RebuildAlertProps = {
    refId: string;
    hasRights: boolean;
};

/**
 * An alert that appears when the reference has unbuilt changes.
 *
 * @param refId - the unique identifier of the parent reference
 * @param hasRights - whether the user has sufficient permission to rebuild the index
 * @returns An rebuild alert
 */
export function RebuildAlert({ refId, hasRights }: RebuildAlertProps) {
    const { data, isLoading } = useInfiniteFindIndexes(refId);
    if (isLoading) {
        return null;
    }

    const indexes = data.pages[0];

    if (indexes.total_otu_count === 0 && hasRights) {
        return (
            <Alert color="orange" level>
                <Icon name="exclamation-circle" />
                <strong>At least one OTU must be added to the database before an index can be built.</strong>
            </Alert>
        );
    }

    if (indexes.change_count && hasRights) {
        const to = {
            pathname: `/refs/${refId}/indexes`,
            state: { rebuild: true },
        };

        return (
            <Alert color="orange" level>
                <Icon name="info-circle" />
                <span>
                    <span>There are unbuilt changes. </span>
                    <Link to={to}>Rebuild the index</Link>
                    <span> to use the changes in future analyses.</span>
                </span>
            </Alert>
        );
    }

    return null;
}

export function mapStateToProps(state) {
    return {
        refId: state.references.detail.id,
        hasRights: checkReferenceRight(state, "build"),
    };
}

export default connect(mapStateToProps)(RebuildAlert);
