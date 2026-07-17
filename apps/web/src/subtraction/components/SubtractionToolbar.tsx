import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { useDebouncedDraft } from "@app/hooks";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
import SubtractionCreate from "./SubtractionCreate";

type SubtractionToolbarProps = {
	/** Current search term used for filtering */
	term: string;

	/** Update the search term in the url */
	setTerm: (term: string) => void;
};

export default function SubtractionToolbar({
	setTerm,
	term,
}: SubtractionToolbarProps) {
	const { hasPermission } = useCheckAdminRoleOrPermission("modify_subtraction");

	const [draft, setDraft] = useDebouncedDraft(term, setTerm);

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					aria-label="Search subtractions"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder="Name"
				/>
			</div>
			{hasPermission && <SubtractionCreate />}
		</Toolbar>
	);
}
