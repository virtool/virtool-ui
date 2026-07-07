import { useFindUsers } from "@administration/queries";
import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import { CircleAlert } from "lucide-react";
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
	const { data, isPending, isError } = useFindUsers(
		urlPage,
		25,
		term,
		undefined,
		status === "active",
	);

	if (isError && !data) {
		return <QueryError noun="users" />;
	}

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
		<Box>
			<Empty orientation="horizontal">
				<EmptyMedia>
					<CircleAlert size={18} />
				</EmptyMedia>
				<EmptyTitle>No users found</EmptyTitle>
			</Empty>
		</Box>
	);
}
