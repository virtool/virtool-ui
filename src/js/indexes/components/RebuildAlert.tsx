import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Icon } from "../../base";
import { checkReferenceRight } from "../../references/selectors";
import { useInfiniteFindIndexes } from "../querys";

export function RebuildAlert({ refId, hasRights }) {
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

export const mapStateToProps = state => ({
    refId: state.references.detail.id,
    hasRights: checkReferenceRight(state, "build"),
});

export default connect(mapStateToProps)(RebuildAlert);
