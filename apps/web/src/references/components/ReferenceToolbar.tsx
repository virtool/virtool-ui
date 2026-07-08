import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { useDebouncedDraft } from "@app/hooks";
import Button from "@base/Button";
import InputSearch from "@base/InputSearch";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";
import Toolbar from "@base/Toolbar";

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

	const [draft, setDraft] = useDebouncedDraft(find, setFind);

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					placeholder="Reference name"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
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
				<Button color="blue" onClick={onCreate}>
					Create
				</Button>
			)}
		</Toolbar>
	);
}
