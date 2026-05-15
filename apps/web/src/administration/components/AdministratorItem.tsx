import { useSetAdministratorRole } from "@administration/queries";
import type {
	AdministratorRole,
	AdministratorRoleName,
} from "@administration/types";
import IconButton from "@base/IconButton";
import InitialIcon from "@base/InitialIcon";
import type { User } from "@users/types";
import { Trash } from "lucide-react";
import AdministratorRoleSelect from "./AdministratorRoleSelect";

type AdministratorItemProps = {
	roles: AdministratorRole[];
	user: User;
};

export default function AdministratorItem({
	user,
	roles,
}: AdministratorItemProps) {
	const editMutation = useSetAdministratorRole();

	function onChange(value: AdministratorRoleName) {
		editMutation.mutate({ user_id: user.id, role: value });
	}

	return (
		<div
			className="mb-2.5 flex items-center shadow-md [&>button]:ml-auto [&>button:last-child]:ml-2.5 [&>svg]:mr-2.5"
			key={user.id}
		>
			<InitialIcon handle={user.handle} size="lg" />
			<span className="text-base font-medium">{user.handle}</span>
			<AdministratorRoleSelect
				id={`role-${user.id}`}
				onChange={onChange}
				roles={roles}
				value={user.administrator_role}
			/>
			<IconButton
				IconComponent={Trash}
				color="red"
				tip="remove administrator role"
				onClick={() => onChange(null)}
			/>
		</div>
	);
}
