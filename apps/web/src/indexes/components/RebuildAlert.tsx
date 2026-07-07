import Alert from "@base/Alert";
import Link from "@base/Link";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { Info } from "lucide-react";
import { useFindIndexes } from "../queries";

type RebuildAlertProps = {
	page: number;
	refId: string;
};

/**
 * An alert that appears when the reference has unbuilt changes.
 */
export default function RebuildAlert({ page, refId }: RebuildAlertProps) {
	const { data, isPending, isError } = useFindIndexes(page, 25, refId);
	const { hasPermission: hasRights } = useCheckReferenceRight(refId, "build");
	const archived = useReferenceIsArchived(refId);

	// Stay silent on error: this is a supplementary alert, and the index list
	// that renders it already surfaces the failure.
	if (isError || isPending || archived) {
		return null;
	}

	const { change_count } = data;

	if (change_count && hasRights) {
		return (
			<Alert color="orange" level icon={Info}>
				<span>
					<span>There are unbuilt changes. </span>
					<Link to="/refs/$refId/indexes" params={{ refId }}>
						Rebuild the index
					</Link>
					<span> to use the changes in future analyses.</span>
				</span>
			</Alert>
		);
	}

	return null;
}
