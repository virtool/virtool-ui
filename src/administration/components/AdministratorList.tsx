import { useFetchAccount } from "@account/queries";
import InputSearch from "@base/InputSearch";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import Toolbar from "@base/Toolbar";
import { useState } from "react";
import { useFindUsers, useGetAdministratorRoles } from "../queries";
import AdministratorCreate from "./AdministratorCreate";
import AdministratorItem from "./AdministratorItem";

type ManageAdministratorsProps = {
	page?: number;
	setPage?: (page: number) => void;
};

function renderRow(roles) {
	function AdministratorRow(item) {
		return <AdministratorItem key={item.id} user={item} roles={roles} />;
	}
	return AdministratorRow;
}

export default function ManageAdministrators({
	page = 1,
	setPage = () => {},
}: ManageAdministratorsProps) {
	const [term, setTerm] = useState("");

	const { data: users, isPending: isPendingUsers } = useFindUsers(
		page,
		25,
		term,
		true,
	);

	const { data: account, isPending: isPendingAccount } = useFetchAccount();
	const { data: roles, isPending: isPendingRoles } = useGetAdministratorRoles();

	if (isPendingUsers || isPendingRoles || isPendingAccount) {
		return <LoadingPlaceholder />;
	}

	const filteredUsers = users.items.filter((user) => user.id !== account.id);

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
				<AdministratorCreate />
			</Toolbar>
			<Pagination
				items={filteredUsers}
				renderRow={renderRow(roles)}
				storedPage={users.page}
				currentPage={page}
				pageCount={users.page_count}
				onPageChange={setPage}
			/>
			{!filteredUsers.length && <NoneFoundBox noun="administrators" />}
		</>
	);
}
