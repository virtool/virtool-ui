import { useFindUsers } from "@administration/queries";
import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
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
	const { data, isPending } = useFindUsers(
		urlPage,
		25,
		term,
		undefined,
		status === "active",
	);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const { items, page, page_count } = data;

	return items.length ? (
		<Pagination
			items={items}
			storedPage={page}
			currentPage={urlPage}
			pageCount={page_count}
			onPageChange={setPage}
		>
			<BoxGroup>
				{items.map((item: User) => (
					<UserItem key={item.id} {...item} />
				))}
			</BoxGroup>
		</Pagination>
	) : (
		<NoneFoundBox noun="users" />
	);
}
