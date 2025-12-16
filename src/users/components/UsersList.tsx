import { useFindUsers } from "@administration/queries";
import { usePageParam, useUrlSearchParam } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import { User } from "../types";
import { UserItem } from "./UserItem";

type UsersListProps = {
    /** The search term used for filtering users */
    term: string;
};

/**
 * A paginated list of users
 */
export default function UsersList({ term }: UsersListProps) {
    const { page: urlPage } = usePageParam();
    const { value: status } = useUrlSearchParam<string>("status");
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
