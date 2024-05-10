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
            flex: 2 0 auto;
            font-size: ${getFontSize("xl")};
            font-weight: ${getFontWeight("thick")};
            line-height: 1.2;
            margin: 0;

            ${Label} {
                font-size: ${getFontSize("md")};
                margin-left: auto;
            }
        }
    }
`;

const AdministratorTag = styled(Label)`
    text-transform: capitalize;
`;

/**
 * Displays information related to the users account with options to reset password and email
 */
export default function AccountProfile() {
    const { data, isLoading } = useFetchAccount();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const { administrator_role, groups, handle } = data;

    return (
        <>
            <AccountProfileHeader>
                <InitialIcon handle={handle} size="xxl" />
                <div>
                    <h3>
                        {handle}
                        {administrator_role && (
                            <AdministratorTag key="administrator" color="purple">
                                <Icon name="user-shield" /> {administrator_role} Administrator
                            </AdministratorTag>
                        )}
                    </h3>
                </div>
            </AccountProfileHeader>

            <ChangePassword lastPasswordChange={data.last_password_change} />
            <Email email={data.email} />
            <AccountGroups groups={groups} />
        </>
    );
}
