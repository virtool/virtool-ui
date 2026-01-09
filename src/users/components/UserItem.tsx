import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoleName } from "@administration/types";
import BoxGroupSection from "@base/BoxGroupSection";
import InitialIcon from "@base/InitialIcon";
import Label from "@base/Label";
import Link from "@base/Link";
import { GroupMinimal } from "@groups/types";

type UserItemProps = {
    administrator_role: AdministratorRoleName;
    handle: string;
    id: number;
    /** The primary group assigned to the user */
    primary_group: GroupMinimal;
};

/**
 * A condensed user item for use in a list of users
 */
export function UserItem({
    administrator_role,
    handle,
    id,
    primary_group,
}: UserItemProps): JSX.Element {
    const { hasPermission: canEdit } = useCheckAdminRole(
        administrator_role === null
            ? AdministratorRoleName.USERS
            : AdministratorRoleName.FULL,
    );

    return (
        <BoxGroupSection className="grid grid-cols-4 items-center">
            <div className="col-span-2 flex items-center gap-3">
                <InitialIcon size="lg" handle={handle} />
                {canEdit ? (
                    <Link
                        to={`/administration/users/${id}`}
                        className="text-lg font-medium"
                    >
                        {handle}
                    </Link>
                ) : (
                    <strong className="text-lg font-medium">{handle}</strong>
                )}
            </div>
            <div className="flex items-center text-sm capitalize">
                {administrator_role && (
                    <Label color="purple">
                        {administrator_role} Administrator
                    </Label>
                )}
            </div>
            <div className="flex items-center text-sm capitalize">
                {primary_group && <Label>{primary_group.name}</Label>}
            </div>
        </BoxGroupSection>
    );
}
