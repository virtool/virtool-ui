import Button from "@base/Button";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import type { ReferenceRemotesFrom } from "@references/types";
import type { ChangeEvent } from "react";

type OtuToolbarProps = {
	/** Current search term used for filtering */
	term: string;

	/** A callback function to handle changes in search input */
	onChange: (term: ChangeEvent<HTMLInputElement>) => void;

	/** Called when the user clicks the Create button */
	onCreate: () => void;

	/** ID of the OTU's parent reference */
	refId: string;

	/** Whether the reference is installed from a remote. */
	remotesFrom: ReferenceRemotesFrom | null;
};

/**
 * A toolbar which allows the OTUs to be filtered by their names
 */
export default function OtuToolbar({
	term,
	onChange,
	onCreate,
	refId,
	remotesFrom,
}: OtuToolbarProps) {
	const { hasPermission: canCreate } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);
	const archived = useReferenceIsArchived(refId);

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					placeholder="Name or abbreviation"
					value={term}
					onChange={onChange}
				/>
			</div>

			{canCreate && !remotesFrom && !archived && (
				<Button onClick={onCreate} color="blue">
					Create
				</Button>
			)}
		</Toolbar>
	);
}
