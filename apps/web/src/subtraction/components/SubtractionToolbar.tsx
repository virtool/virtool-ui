import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import SearchToolbar from "@base/SearchToolbar";
import SubtractionCreate from "./SubtractionCreate";

type SubtractionToolbarProps = {
	onChange: (term: string) => void;
	term: string;
};

export default function SubtractionToolbar({
	onChange,
	term,
}: SubtractionToolbarProps) {
	const { hasPermission } = useCheckAdminRoleOrPermission("modify_subtraction");

	return (
		<SearchToolbar
			aria-label="Search subtractions"
			onChange={onChange}
			placeholder="Name"
			value={term}
		>
			{hasPermission && <SubtractionCreate />}
		</SearchToolbar>
	);
}
