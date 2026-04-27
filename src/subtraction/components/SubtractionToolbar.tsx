import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { useDialogParam } from "@app/hooks";
import Button from "@base/Button";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
import SubtractionCreate from "./SubtractionCreate";

type SubtractionToolbarProps = {
	term: string;
	handleChange: (any) => void;
};

export default function SubtractionToolbar({
	term,
	handleChange,
}: SubtractionToolbarProps) {
	const { hasPermission } = useCheckAdminRoleOrPermission("modify_subtraction");
	const { setOpen } = useDialogParam("openCreateSubtraction");

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch value={term} onChange={handleChange} placeholder="Name" />
			</div>
			{hasPermission && (
				<Button color="blue" onClick={() => setOpen(true)}>
					Create
				</Button>
			)}
			<SubtractionCreate />
		</Toolbar>
	);
}
