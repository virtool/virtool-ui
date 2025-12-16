import { formatIsolateName } from "@app/utils";
import Alert from "@base/Alert";
import styled from "styled-components";
import { OtuIsolate } from "../types";

const StyledOTUIssues = styled(Alert)`
    h5 {
        font-weight: bold;
        margin: 0 0 15px;
    }

    ul {
        margin: 0 0 10px;
    }
`;

type OtuIssuesProps = {
    /** The isolates associated with the OTU */
    isolates: OtuIsolate[];
    /** The issues that occurred */
    issues: { [key: string]: any } | boolean;
};

/**
 * Displays a message of any issues that occurred for the OTU
 */
export default function OtuIssues({ isolates, issues }: OtuIssuesProps) {
    const errors = [];

    // The OTU has no isolates associated with it.
    if (typeof issues === "object" && issues.empty_otu) {
        errors.push(
            <li key="emptyOTU">
                There are no isolates associated with this OTU
            </li>,
        );
    }

    // The OTU has an inconsistent number of sequences between isolates.
    if (typeof issues === "object" && issues.isolate_inconsistency) {
        errors.push(
            <li key="isolateInconsistency">
                Some isolates have different numbers of sequences than other
                isolates
            </li>,
        );
    }

    // One or more isolates have no sequences associated with them.
    if (typeof issues === "object" && issues.empty_isolate) {
        // The empty_isolate property is an array of isolate_ids of empty isolates.
        const emptyIsolates = issues.empty_isolate.map((isolateId, index) => {
            // Get the entire isolate identified by isolate_id from the detail data.
            const isolate = isolates.find((i) => i.id === isolateId);

            return <li key={index}>{formatIsolateName(isolate)}</li>;
        });

        errors.push(
            <li key="emptyIsolate">
                There are no sequences associated with the following isolates:
                <ul>{emptyIsolates}</ul>
            </li>,
        );
    }

    // One or more sequence documents have no sequence field.
    if (typeof issues === "object" && issues.empty_sequence) {
        // Make a list of sequences that have no defined sequence field.
        const emptySequences = issues.empty_sequence.map(
            (errorObject, index) => {
                // Get the entire isolate object identified by the isolate_id.
                const isolate = isolates.find(
                    (i) => i.id === errorObject.isolate_id,
                );
                return (
                    <li key={index}>
                        <span>
                            <em>{errorObject._id}</em> in isolate{" "}
                            <em>{formatIsolateName(isolate)}</em>
                        </span>
                    </li>
                );
            },
        );

        errors.push(
            <li key="emptySequence">
                There are sequence records with undefined <code>sequence</code>{" "}
                fields:
                <ul>{emptySequences}</ul>
            </li>,
        );
    }

    return (
        <StyledOTUIssues color="orange" block>
            <h5>
                There are some issues that must be resolved before this OTU can
                be included in the next index build
            </h5>
            <ul>{errors}</ul>
        </StyledOTUIssues>
    );
}
