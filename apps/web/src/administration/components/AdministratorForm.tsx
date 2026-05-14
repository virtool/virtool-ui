import {
	useFindUsers,
	useGetAdministratorRoles,
	useSetAdministratorRole,
} from "@administration/queries";
import type { AdministratorRoleName } from "@administration/types";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import SaveButton from "@base/SaveButton";
import type { User } from "@users/types";
import { type ReactElement, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AdministratorRoleSelect from "./AdministratorRoleSelect";
import AdministratorUserSelect from "./AdministratorUserSelect";

type FormInputValues = {
	role: AdministratorRoleName;
	user: User;
};

type AdministratorFormProps = {
	onClose: () => void;
};

export default function AdministratorForm({
	onClose,
}: AdministratorFormProps): ReactElement {
	const {
		formState: { errors },
		handleSubmit,
		control,
	} = useForm<FormInputValues>();

	const [userSearchTerm, setUserSearchTerm] = useState("");

	const { data: users } = useFindUsers(1, 25, userSearchTerm, false);
	const { data: roles } = useGetAdministratorRoles();

	const mutator = useSetAdministratorRole();

	function onSubmit({ user, role }: FormInputValues) {
		mutator.mutate({ user_id: user.id, role });
		onClose();
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<InputGroup>
				<InputLabel htmlFor="user">User</InputLabel>
				<div className="flex flex-col [&>button]:grow [&>button]:p-2.5">
					<Controller
						render={({ field: { onChange, value } }) => (
							<AdministratorUserSelect
								onChange={onChange}
								value={value}
								users={users?.items || []}
								onTermChange={setUserSearchTerm}
								term={userSearchTerm}
								id="user"
							/>
						)}
						name="user"
						control={control}
						rules={{ required: "A user must be selected" }}
					/>
				</div>
				<InputError>{errors.user?.message}</InputError>
			</InputGroup>
			<InputGroup>
				<InputLabel htmlFor="role">Role</InputLabel>
				<div className="flex flex-col [&>button]:grow [&>button]:p-2.5">
					<Controller
						render={({ field: { onChange, value } }) => (
							<AdministratorRoleSelect
								onChange={onChange}
								value={value}
								roles={roles || []}
								id="role"
							/>
						)}
						name="role"
						control={control}
						rules={{ required: "A role must be selected" }}
					/>
					<InputError>{errors.role?.message}</InputError>
				</div>
			</InputGroup>
			<SaveButton />
		</form>
	);
}
