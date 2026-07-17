import { useDebouncedDraft } from "@app/hooks";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";

type HmmToolbarProps = {
	/** Current search term used for filtering */
	term: string;

	/** Update the search term in the url */
	setTerm: (term: string) => void;
};

/**
 * A toolbar which allows the HMMs to be filtered by their names
 */
export default function HmmToolbar({ term, setTerm }: HmmToolbarProps) {
	const [draft, setDraft] = useDebouncedDraft(term, setTerm);

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					aria-label="Search HMMs"
					placeholder="Name"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
				/>
			</div>
		</Toolbar>
	);
}
