import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import Button from "@base/Button";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";

type ReferenceToolbarProps = {
	find: string;
	setCreateReferenceType: (type: string) => void;
	setFind: (find: string) => void;
};

/**
 * A toolbar which allows the references to be filtered by name
 */
export default function ReferenceToolbar({
	find,
	setCreateReferenceType,
	setFind,
}: ReferenceToolbarProps) {
	const { hasPermission: canCreate } =
		useCheckAdminRoleOrPermission("create_ref");

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					placeholder="Reference name"
					value={find}
					onChange={(e) => setFind(e.target.value)}
				/>
			</div>
			{canCreate && (
				<Button color="blue" onClick={() => setCreateReferenceType("empty")}>
					Create
				</Button>
			)}
		</Toolbar>
	);
}
