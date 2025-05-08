import Icon from "@base/Icon";
import InitialIcon from "@base/InitialIcon";
import Label from "@base/Label";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import React from "react";
import { useFetchAccount } from "../queries";
import AccountEmail from "./AccountEmail";
import AccountGroups from "./AccountGroups";
import AccountPassword from "./AccountPassword";

/**
 * Displays information related to the users account with options to reset password and email
 */
export default function AccountProfile() {
    const { data, isPending } = useFetchAccount();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const { administrator_role, email, groups, handle, last_password_change } =
        data;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <header className="flex font-medium items-center gap-4 text-2xl">
                    <InitialIcon handle={handle} size="xxl" />
                    <h3>{handle}</h3>
                </header>

                <div>
                    {administrator_role && (
                        <Label
                            key="administrator"
                            className="capitalize text-base ml-auto"
                            color="purple"
                        >
                            <Icon name="user-shield" /> {administrator_role}{" "}
                            Administrator
                        </Label>
                    )}
                </div>
            </div>

            <AccountPassword lastPasswordChange={last_password_change} />
            <AccountEmail email={email} />
            <AccountGroups groups={groups} />
        </>
    );
}
