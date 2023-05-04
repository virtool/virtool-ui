import { filter } from "lodash-es";
import React, { useState } from "react";
import { useGetAccount } from "../../../account/querys";
import { Account } from "../../../account/types";
import { InputSearch, LoadingPlaceholder, NoneFoundBox, Pagination, Toolbar } from "../../../base";
import { UserResponse } from "../../../users/types";
import { useGetAdministratorRoles, useGetUsers } from "../../querys";
import { AdministratorRole } from "../../types";
import { CreateAdministrator } from "./Create";
import { AdministratorItem } from "./Item";

const renderRow = roles => item => <AdministratorItem key={item.id} user={item} roles={roles} />;
export const ManageAdministrators = () => {
    const [term, setTerm] = useState("");

    const page = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

    const { data: users, isLoading: isLoadingUsers }: { data: UserResponse; isLoading: boolean } = useGetUsers(
        page,
        25,
        term,
        true,
    );

    const { data: account, isLoading: isLoadingAccount }: { data: Account; isLoading: boolean } = useGetAccount();
    const { data: roles, isLoading: isLoadingRoles }: { data: Array<AdministratorRole>; isLoading: boolean } =
        useGetAdministratorRoles();

    if (isLoadingUsers || isLoadingRoles || isLoadingAccount) {
        return <LoadingPlaceholder />;
    }

    const filteredUsers = filter(users.items, user => user.id !== account.id);

    return (
        <>
            <Toolbar>
                <InputSearch name="search" aria-label="search" value={term} onChange={e => setTerm(e.target.value)} />
                <CreateAdministrator />
            </Toolbar>
            <Pagination
                items={filteredUsers}
                renderRow={renderRow(roles)}
                storedPage={users.page}
                currentPage={page}
                pageCount={users.page_count}
                onLoadNextPage={() => {}}
            />
            {!filteredUsers.length && <NoneFoundBox noun="administrators" />}
        </>
    );
};
