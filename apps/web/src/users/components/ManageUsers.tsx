import { useCheckAdminRole } from "@administration/hooks";
import Alert from "@base/Alert";
import InputSearch from "@base/InputSearch";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";
import Toolbar from "@base/Toolbar";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import CreateUser from "./CreateUser";
import UsersList from "./UsersList";

type ManageUsersProps = {
	openCreateUser?: boolean;
	page?: number;
	setSearch?: (next: {
		openCreateUser?: boolean;
		page?: number;
		status?: string;
	}) => void;
	status?: string;
};

/**
 * Displays a list of editable users and tools for sorting through and creating users
 */
export function ManageUsers({
	openCreateUser = false,
	page = 1,
	setSearch = () => {},
	status = "active",
}: ManageUsersProps) {
	const [term, setTerm] = useState("");
	const { hasPermission, isPending } = useCheckAdminRole("users");

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	if (hasPermission) {
		return (
			<>
				<Toolbar>
					<div className="flex-grow">
						<InputSearch
							name="search"
							aria-label="search"
							value={term}
							onChange={(e) => setTerm(e.target.value)}
						/>
					</div>
					<ToggleGroup
						value={status}
						onValueChange={(status) => setSearch({ status })}
					>
						<ToggleGroupItem value="active">Active</ToggleGroupItem>
						<ToggleGroupItem value="deactivated">Deactivated</ToggleGroupItem>
					</ToggleGroup>
					<CreateUser
						open={openCreateUser}
						setOpen={(openCreateUser) => setSearch({ openCreateUser })}
					/>
				</Toolbar>

				<UsersList
					page={page}
					setPage={(page) => setSearch({ page })}
					status={status}
					term={term}
				/>
			</>
		);
	}

	return (
		<Alert color="orange" level>
			<CircleAlert />
			<span>
				<strong>You do not have permission to manage users.</strong>
				<span> Contact an administrator.</span>
			</span>
		</Alert>
	);
}
