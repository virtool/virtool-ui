import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
import SubtractionCreate from "./SubtractionCreate";

type SubtractionToolbarProps = {
	handleChange: (any) => void;
	term: string;
};

export default function SubtractionToolbar({
	handleChange,
	term,
}: SubtractionToolbarProps) {
	const { hasPermission } = useCheckAdminRoleOrPermission("modify_subtraction");

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					aria-label="Search subtractions"
					value={term}
					onChange={handleChange}
					placeholder="Name"
				/>
			</div>
			{hasPermission && <SubtractionCreate />}
		</Toolbar>
	);
}
