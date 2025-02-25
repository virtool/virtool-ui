import { useFindUsers } from "@administration/queries";
import { BoxGroup, LoadingPlaceholder, NoneFoundBox, Pagination } from "@base";
import { usePageParam, useUrlSearchParam } from "@utils/hooks";
import { map } from "lodash";
import React from "react";
import { User } from "../types";
import { UserItem } from "./UserItem";

type UsersListProps = {
    /** The search term used for filtering users */
    term: string;
};

/**
 * A paginated list of users
 */
export function UsersList({ term }: UsersListProps) {
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
                {map(items, (item: User) => (
                    <UserItem key={item.id} {...item} />
                ))}
            </BoxGroup>
        </Pagination>
    ) : (
        <NoneFoundBox noun="users" />
    );
}
