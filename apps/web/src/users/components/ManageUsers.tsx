import { useCheckAdminRole } from "@administration/hooks";
import Alert from "@base/Alert";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SearchToolbar from "@base/SearchToolbar";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import CreateUser from "./CreateUser";
import UsersList from "./UsersList";

type ManageUsersProps = {
	page?: number;
	setSearch?: (next: { page?: number; status?: string }) => void;
	status?: string;
};

/**
 * Displays a list of editable users and tools for sorting through and creating users
 */
export function ManageUsers({
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
				<SearchToolbar
					aria-label="Search users"
					onChange={setTerm}
					placeholder="Username"
					value={term}
				>
					<ToggleGroup
						value={status}
						onValueChange={(status) => setSearch({ status })}
					>
						<ToggleGroupItem value="active">Active</ToggleGroupItem>
						<ToggleGroupItem value="deactivated">Deactivated</ToggleGroupItem>
					</ToggleGroup>
					<CreateUser />
				</SearchToolbar>

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
