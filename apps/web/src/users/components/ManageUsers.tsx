import { useCheckAdminRole } from "@administration/hooks";
import { useDebouncedDraft } from "@app/hooks";
import Alert from "@base/Alert";
import InputSearch from "@base/InputSearch";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import ToggleGroup from "@base/ToggleGroup";
import ToggleGroupItem from "@base/ToggleGroupItem";
import Toolbar from "@base/Toolbar";
import { CircleAlert } from "lucide-react";
import CreateUser from "./CreateUser";
import UsersList from "./UsersList";

type ManageUsersProps = {
	page?: number;
	setSearch?: (
		next: { page?: number; status?: string; term?: string },
		options?: { replace?: boolean },
	) => void;
	status?: string;
	term?: string;
};

/**
 * Displays a list of editable users and tools for sorting through and creating users
 */
export function ManageUsers({
	page = 1,
	setSearch = () => {},
	status = "active",
	term = "",
}: ManageUsersProps) {
	const { hasPermission, isPending } = useCheckAdminRole("users");
	const [draft, setDraft] = useDebouncedDraft(term, (term) =>
		setSearch({ term, page: 1 }, { replace: true }),
	);

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
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
						/>
					</div>
					<ToggleGroup
						value={status}
						onValueChange={(status) => setSearch({ status })}
					>
						<ToggleGroupItem value="active">Active</ToggleGroupItem>
						<ToggleGroupItem value="deactivated">Deactivated</ToggleGroupItem>
					</ToggleGroup>
					<CreateUser />
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
