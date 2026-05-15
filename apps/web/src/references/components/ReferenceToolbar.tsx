import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import Button from "@base/Button";
import InputSearch from "@base/InputSearch";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";
import Toolbar from "@base/Toolbar";

type ReferenceToolbarProps = {
	archived: boolean;
	find: string;
	setArchived: (archived: boolean) => void;
	setCreateReferenceType: (type: string) => void;
	setFind: (find: string) => void;
};

/**
 * A toolbar which allows the references to be filtered by name and lifecycle
 */
export default function ReferenceToolbar({
	archived,
	find,
	setArchived,
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
			<ToggleGroup
				value={archived ? "archived" : "active"}
				onValueChange={(value) => setArchived(value === "archived")}
			>
				<ToggleGroupItem value="active">Active</ToggleGroupItem>
				<ToggleGroupItem value="archived">Archived</ToggleGroupItem>
			</ToggleGroup>
			{canCreate && (
				<Button color="blue" onClick={() => setCreateReferenceType("empty")}>
					Create
				</Button>
			)}
		</Toolbar>
	);
}
