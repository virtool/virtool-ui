import InputSearch from "@base/InputSearch";
import LinkButton from "@base/LinkButton";
import Toolbar from "@base/Toolbar";
import { useCheckReferenceRight } from "@references/hooks";
import type { ReferenceRemotesFrom } from "@references/types";
import type { ChangeEvent } from "react";

type OtuToolbarProps = {
	/** Current search term used for filtering */
	term: string;

	/** A callback function to handle changes in search input */
	onChange: (term: ChangeEvent<HTMLInputElement>) => void;

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
	refId,
	remotesFrom,
}: OtuToolbarProps) {
	const { hasPermission: canCreate } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					placeholder="Name or abbreviation"
					value={term}
					onChange={onChange}
				/>
			</div>

			{canCreate && !remotesFrom && (
				<LinkButton to="." search={{ openCreateOTU: true }} color="blue">
					Create
				</LinkButton>
			)}
		</Toolbar>
	);
}
