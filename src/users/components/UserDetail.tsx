import Label from "@/base/Label";
import { useCheckAdminRole } from "@administration/hooks";
import { useFetchUser, useUpdateUser } from "@administration/queries";
import { AdministratorRoleName } from "@administration/types";
import { usePathParams } from "@app/hooks";
import Alert from "@base/Alert";
import Icon from "@base/Icon";
import InitialIcon from "@base/InitialIcon";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { ShieldUserIcon } from "lucide-react";
import Password from "./Password";
import PrimaryGroup from "./PrimaryGroup";
import { UserActivationBanner } from "./UserActivationBanner";
import UserGroups from "./UserGroups";
import UserPermissions from "./UserPermissions";

/**
 * The detailed view of a user
 */
export default function UserDetail() {
    const { userId } = usePathParams<{ userId: string }>();
    const { data, isPending } = useFetchUser(Number(userId));
    const { hasPermission: canEdit } = useCheckAdminRole(
        data?.administrator_role === null
            ? AdministratorRoleName.USERS
            : AdministratorRoleName.FULL,
    );

    const mutation = useUpdateUser();

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
            <header className="flex items-center justify-between mb-5">
                <h2 className="flex items-center text-2xl gap-3">
                    <InitialIcon size="xl" handle={handle} />
                    <span>{handle}</span>
                </h2>
                {administrator_role && (
                    <Label>
                        <ShieldUserIcon aria-label="Administrator" size={18} />
                        Administrator
                    </Label>
                )}
            </header>

            <Password
                key={id}
                id={id}
                lastPasswordChange={last_password_change}
                forceReset={force_reset}
            />

            <div className="mb-4 md:grid md:grid-cols-2 md:gap-x-4">
                <div>
                    <UserGroups userId={id} memberGroups={groups} />
                    <PrimaryGroup
                        groups={groups}
                        id={id}
                        primaryGroup={primary_group}
                    />
                </div>
                <UserPermissions permissions={permissions} />
            </div>

            <UserActivationBanner
                onClick={() =>
                    mutation.mutate({
                        userId: id,
                        update: { active: !data.active },
                    })
                }
                verb={data.active ? "deactivate" : "activate"}
            />
        </div>
    );
}
