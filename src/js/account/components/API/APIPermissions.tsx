import { useFetchAccount } from "@account/queries";
import { AdministratorPermissions, hasSufficientAdminRole } from "@administration/utils";
import { BoxGroup, Checkbox, SelectBoxGroupSection } from "@base";
import { map, sortBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { getAccountAdministratorRole } from "../../selectors";

type APIPermissionsProps = {
    administratorRole: any;
    className?: string;
    keyPermissions: any;
    onChange: any;
};

export function APIPermissions({ administratorRole, className, keyPermissions, onChange }: APIPermissionsProps) {
    const permissions = map(keyPermissions, (value, key) => ({
        name: key,
        allowed: value,
    }));

    const { data, isLoading } = useFetchAccount();

    if (isLoading) {
        return null;
    }

    const rowComponents = map(sortBy(permissions, "name"), permission => {
        const disabled =
            !hasSufficientAdminRole(AdministratorPermissions[permission.name], administratorRole) &&
            !data.permissions[permission.name];

        return (
            <SelectBoxGroupSection
                key={permission.name}
                active={permission.allowed}
                onClick={
                    disabled ? null : () => onChange({ ...keyPermissions, [permission.name]: !permission.allowed })
                }
                disabled={disabled}
            >
                <Checkbox checked={permission.allowed} />
                <code>{permission.name}</code>
            </SelectBoxGroupSection>
        );
    });

    return <BoxGroup className={className}>{rowComponents}</BoxGroup>;
}

const mapStateToProps = state => ({
    administratorRole: getAccountAdministratorRole(state),
});

export default connect(mapStateToProps)(APIPermissions);
