import { useCheckAdminRole } from "@administration/hooks";
import { useFetchUser } from "@administration/queries";
import { AdministratorRoleName } from "@administration/types";
import { useDialogParam, usePathParams } from "@app/hooks";
import { getFontSize, getFontWeight } from "@app/theme";
import Alert from "@base/Alert";
import { device } from "@base/device";
import Icon from "@base/Icon";
import InitialIcon from "@base/InitialIcon";
import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import React from "react";
import styled from "styled-components";
import Password from "./Password";
import PrimaryGroup from "./PrimaryGroup";
import { UserActivation } from "./UserActivation";
import { UserActivationBanner } from "./UserActivationBanner";
import UserGroups from "./UserGroups";
import UserPermissions from "./UserPermissions";

const AdminIcon = styled(Icon)`
    padding-left: 10px;
`;

const UserDetailGroups = styled.div`
    margin-bottom: 15px;

    @media (min-width: ${device.tablet}) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: ${(props) => props.theme.gap.column};
    }
`;

const UserDetailHeader = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const UserDetailTitle = styled.div`
    align-items: center;
    display: flex;
    flex: 1 0 auto;
    font-size: ${getFontSize("xl")};
    font-weight: ${getFontWeight("bold")};
    margin-left: 15px;
    .InitialIcon {
        margin-right: 8px;
    }
    a {
        font-size: ${getFontSize("md")};
        margin-left: auto;
    }
`;

/**
 * The detailed view of a user
 */
export default function UserDetail() {
    const { userId } = usePathParams<{ userId: string }>();
    const { data, isPending } = useFetchUser(userId);
    const { hasPermission: canEdit } = useCheckAdminRole(
        data?.administrator_role === null
            ? AdministratorRoleName.USERS
            : AdministratorRoleName.FULL,
    );

    const { open: openActivateUser, setOpen: setOpenActivateUser } =
        useDialogParam("openActivateUser");
    const { open: openDeactivateUser, setOpen: setOpenDeactivateUser } =
        useDialogParam("openDeactivateUser");

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    if (!canEdit) {
        return (
            <Alert color="orange" level>
                <Icon name="exclamation-circle" />
                <span>
                    <strong>
                        You do not have permission to manage this user.
                    </strong>
                    <span> Contact an administrator.</span>
                </span>
            </Alert>
        );
    }

    const {
        handle,
        administrator_role,
        id,
        groups,
        primary_group,
        permissions,
        last_password_change,
        force_reset,
    } = data;

    return (
        <div>
            <UserDetailHeader>
                <UserDetailTitle>
                    <InitialIcon size="xl" handle={handle} />
                    <span>{handle}</span>
                    {administrator_role ? (
                        <AdminIcon
                            aria-label="admin"
                            name="user-shield"
                            color="blue"
                        />
                    ) : null}
                    <Link to="/administration/users">Back To List</Link>
                </UserDetailTitle>
            </UserDetailHeader>

            <Password
                key={id}
                id={id}
                lastPasswordChange={last_password_change}
                forceReset={force_reset}
            />

            <UserDetailGroups>
                <div>
                    <UserGroups userId={id} memberGroups={groups} />
                    <PrimaryGroup
                        groups={groups}
                        id={id}
                        primaryGroup={primary_group}
                    />
                </div>
                <UserPermissions permissions={permissions} />
            </UserDetailGroups>

            {data.active ? (
                <UserActivationBanner
                    buttonText="Deactivate"
                    noun="deactivate"
                    onClick={() => setOpenDeactivateUser(true)}
                />
            ) : (
                <UserActivationBanner
                    buttonText="Activate"
                    noun="activate"
                    onClick={() => setOpenActivateUser(true)}
                />
            )}

            <UserActivation
                handle={data.handle}
                id={data.id}
                noun="deactivate"
                onHide={() => setOpenDeactivateUser(false)}
                show={openDeactivateUser}
            />
            <UserActivation
                handle={data.handle}
                id={data.id}
                noun="activate"
                onHide={() => setOpenActivateUser(false)}
                show={openActivateUser}
            />
        </div>
    );
}
