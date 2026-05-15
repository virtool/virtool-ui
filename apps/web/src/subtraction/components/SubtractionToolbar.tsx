import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import Button from "@base/Button";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
import SubtractionCreate from "./SubtractionCreate";

type SubtractionToolbarProps = {
	handleChange: (any) => void;
	openCreate: boolean;
	setOpenCreate: (open: boolean) => void;
	term: string;
};

export default function SubtractionToolbar({
	handleChange,
	openCreate,
	setOpenCreate,
	term,
}: SubtractionToolbarProps) {
	const { hasPermission } = useCheckAdminRoleOrPermission("modify_subtraction");

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch value={term} onChange={handleChange} placeholder="Name" />
			</div>
			{hasPermission && (
				<Button color="blue" onClick={() => setOpenCreate(true)}>
					Create
				</Button>
			)}
			<SubtractionCreate open={openCreate} setOpen={setOpenCreate} />
		</Toolbar>
	);
}
