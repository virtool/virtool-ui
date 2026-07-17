import BoxGroup from "@base/BoxGroup";
import ListEmpty from "@base/ListEmpty";
import Pagination from "@base/Pagination";
import { useSuspenseUsers } from "@users/queries";
import { Users } from "lucide-react";
import type { User } from "../types";
import { UserItem } from "./UserItem";

type UsersListProps = {
	page: number;
	setPage: (page: number) => void;
	status: string;
	/** The search term used for filtering users */
	term: string;
};

/**
 * A paginated list of users
 */
export default function UsersList({
	page: urlPage,
	setPage,
	status,
	term,
}: UsersListProps) {
	const { data } = useSuspenseUsers(
		urlPage,
		25,
		term,
		undefined,
		status === "active",
	);

	const { items, page, page_count } = data;

	return items.length ? (
		<Pagination
			items={items}
			storedPage={page}
			currentPage={urlPage}
			pageCount={page_count}
			onPageChange={setPage}
		>
			<BoxGroup as="ul">
				{items.map((item: User) => (
					<UserItem key={item.id} {...item} />
				))}
			</BoxGroup>
		</Pagination>
	) : (
		<ListEmpty
			icon={Users}
			title="No users found"
			description="No users match your search."
		/>
	);
}
