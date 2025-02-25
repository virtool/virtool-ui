import AccountGroups from "@account/components/AccountGroups";
import { useFetchAccount } from "@account/queries";
import { getFontSize, getFontWeight } from "@app/theme";
import { Icon, InitialIcon, Label, LoadingPlaceholder } from "@base";
import React from "react";
import styled from "styled-components";
import ChangePassword from "./ChangePassword";
import Email from "./Email";

const AccountProfileHeader = styled.div`
    align-items: center;
    display: flex;
    margin-bottom: 15px;
    > div {
        flex: 2 0 auto;
        margin-left: 15px;

        h3 {
            align-items: center;
            display: flex;
            justify-content: space-between;
            flex: 2 0 auto;
            font-size: ${getFontSize("xl")};
            font-weight: ${getFontWeight("thick")};
            line-height: 1.2;
            margin: 0;
        }
    }
`;

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
            <AccountProfileHeader>
                <InitialIcon handle={handle} size="xxl" />
                <div>
                    <h3>
                        {handle}
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
                    </h3>
                </div>
            </AccountProfileHeader>

            <ChangePassword lastPasswordChange={last_password_change} />
            <Email email={email} />
            <AccountGroups groups={groups} />
        </>
    );
}
