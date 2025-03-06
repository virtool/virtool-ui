import { useFetchAccount } from "@account/queries";
import {
    InputSearch,
    LoadingPlaceholder,
    NoneFoundBox,
    Pagination,
} from "@/base";
import Toolbar from "@base/Toolbar";
import { usePageParam } from "@/hooks";
import { filter } from "lodash-es";
import React, { useState } from "react";
import { useFindUsers, useGetAdministratorRoles } from "../../queries";
import { CreateAdministrator } from "./Create";
import { AdministratorItem } from "./Item";

const renderRow = (roles) => (item) => (
    <AdministratorItem key={item.id} user={item} roles={roles} />
);

export function ManageAdministrators() {
    const [term, setTerm] = useState("");
    const { page } = usePageParam();

    const { data: users, isPending: isPendingUsers } = useFindUsers(
        page,
        25,
        term,
        true,
    );

    const { data: account, isPending: isPendingAccount } = useFetchAccount();
    const { data: roles, isPending: isPendingRoles } =
        useGetAdministratorRoles();

    if (isPendingUsers || isPendingRoles || isPendingAccount) {
        return <LoadingPlaceholder />;
    }

    const filteredUsers = filter(users.items, (user) => user.id !== account.id);

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
                <CreateAdministrator />
            </Toolbar>
            <Pagination
                items={filteredUsers}
                renderRow={renderRow(roles)}
                storedPage={users.page}
                currentPage={page}
                pageCount={users.page_count}
            />
            {!filteredUsers.length && <NoneFoundBox noun="administrators" />}
        </>
    );
}
