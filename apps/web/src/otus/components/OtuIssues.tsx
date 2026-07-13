import { formatIsolateName } from "@app/utils";
import Alert from "@base/Alert";
import type { ReactNode } from "react";
import type { OtuIsolate, OtuIssueReport } from "../types";

type OtuIssuesProps = {
	/** The isolates associated with the OTU */
	isolates: OtuIsolate[];
	/** The issues that occurred */
	issues: OtuIssueReport | boolean | null;
};

/**
 * Displays a message of any issues that occurred for the OTU
 */
export default function OtuIssues({ isolates, issues }: OtuIssuesProps) {
	const errors: ReactNode[] = [];

	// The OTU has no isolates associated with it.
	if (issues && typeof issues === "object" && issues.empty_otu) {
		errors.push(
			<li key="emptyOtu">There are no isolates associated with this OTU</li>,
		);
	}

	// The OTU has an inconsistent number of sequences between isolates.
	if (issues && typeof issues === "object" && issues.isolate_inconsistency) {
		errors.push(
			<li key="isolateInconsistency">
				Some isolates have different numbers of sequences than other isolates
			</li>,
		);
	}

	// One or more isolates have no sequences associated with them.
	if (issues && typeof issues === "object" && issues.empty_isolate) {
		// The empty_isolate property is an array of isolate_ids of empty isolates.
		const emptyIsolates = issues.empty_isolate.map((isolateId) => {
			// Get the entire isolate identified by isolate_id from the detail data.
			const isolate = isolates.find((i) => i.id === isolateId);

			return (
				<li key={isolateId}>
					{isolate ? formatIsolateName(isolate) : "Unknown isolate"}
				</li>
			);
		});

		errors.push(
			<li key="emptyIsolate">
				There are no sequences associated with the following isolates:
				<ul>{emptyIsolates}</ul>
			</li>,
		);
	}

	// One or more sequence documents have no sequence field.
	if (issues && typeof issues === "object" && issues.empty_sequence) {
		// Make a list of sequences that have no defined sequence field.
		const emptySequences = issues.empty_sequence.map((errorObject) => {
			// Get the entire isolate object identified by the isolate_id.
			const isolate = isolates.find((i) => i.id === errorObject.isolate_id);
			return (
				<li key={errorObject._id}>
					<span>
						<em>{errorObject._id}</em> in isolate{" "}
						<em>{isolate ? formatIsolateName(isolate) : "Unknown isolate"}</em>
					</span>
				</li>
			);
		});

		errors.push(
			<li key="emptySequence">
				There are sequence records with undefined <code>sequence</code> fields:
				<ul>{emptySequences}</ul>
			</li>,
		);
	}

	return (
		<Alert color="orange" block>
			<h5 className="font-bold mt-0 mb-4">
				There are some issues that must be resolved before this OTU can be
				included in the next index build
			</h5>
			<ul className="mt-0 mb-2.5">{errors}</ul>
		</Alert>
	);
}
