import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
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
			<BoxGroup>
				{items.map((item: User) => (
					<UserItem key={item.id} {...item} />
				))}
			</BoxGroup>
		</Pagination>
	) : (
		<Box>
			<Empty className="h-72">
				<EmptyMedia className="text-gray-400">
					<Users size={40} strokeWidth={1.5} />
				</EmptyMedia>
				<EmptyTitle>No users found</EmptyTitle>
				<EmptyDescription>No users match your search.</EmptyDescription>
			</Empty>
		</Box>
	);
}
