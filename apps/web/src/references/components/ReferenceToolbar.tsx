import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import Button from "@base/Button";
import SearchToolbar from "@base/SearchToolbar";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";

type ReferenceToolbarProps = {
	archived: boolean;
	find: string;
	onCreate: () => void;
	setArchived: (archived: boolean) => void;
	setFind: (find: string) => void;
};

/**
 * A toolbar which allows the references to be filtered by name and lifecycle
 */
export default function ReferenceToolbar({
	archived,
	find,
	onCreate,
	setArchived,
	setFind,
}: ReferenceToolbarProps) {
	const { hasPermission: canCreate } =
		useCheckAdminRoleOrPermission("create_ref");

	return (
		<SearchToolbar
			aria-label="Search references"
			onChange={setFind}
			placeholder="Reference name"
			value={find}
		>
			<ToggleGroup
				value={archived ? "archived" : "active"}
				onValueChange={(value) => setArchived(value === "archived")}
			>
				<ToggleGroupItem value="active">Active</ToggleGroupItem>
				<ToggleGroupItem value="archived">Archived</ToggleGroupItem>
			</ToggleGroup>
			{canCreate && (
				<Button color="blue" onClick={onCreate}>
					Create
				</Button>
			)}
		</SearchToolbar>
	);
}
