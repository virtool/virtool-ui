import { useFetchAccount } from "@account/account";
import type { AdministratorRoleName } from "@administration/types";
import {
	AdministratorPermissions,
	hasSufficientAdminRole,
} from "@administration/utils";
import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import Checkbox from "@base/Checkbox";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import type { Permissions } from "@groups/types";
import { sortBy } from "es-toolkit";

type APIPermissionsProps = {
	"aria-labelledby"?: string;
	className?: string;
	keyPermissions: Permissions;
	/** Callback function to handle permission selection */
	onChange: (permissions: Permissions) => void;
};

/**
 * Manages permissions for creating/updating an API
 */
export default function ApiKeyPermissions({
	"aria-labelledby": ariaLabelledby,
	className,
	keyPermissions,
	onChange,
}: APIPermissionsProps) {
	const { data: account, isPending, isError } = useFetchAccount();

	if (isError && !account) {
		return <QueryError noun="your account" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const permissions = Object.entries(keyPermissions).map(([key, value]) => ({
		name: key,
		allowed: value,
	}));

	const rowComponents = sortBy(permissions, [(p) => p.name]).map(
		(permission) => {
			const disabled =
				!hasSufficientAdminRole(
					AdministratorPermissions[permission.name] as AdministratorRoleName,
					account.administrator_role,
				) && !account.permissions[permission.name];

			return (
				<BoxGroupSection key={permission.name} disabled={disabled}>
					<Checkbox
						checked={permission.allowed}
						id={`ApiPermission-${permission.name}`}
						label={permission.name}
						onClick={
							disabled
								? undefined
								: () =>
										onChange({
											...keyPermissions,
											[permission.name]: !permission.allowed,
										})
						}
					/>
				</BoxGroupSection>
			);
		},
	);

	return (
		<BoxGroup
			className={className}
			role="group"
			aria-labelledby={ariaLabelledby}
		>
			{rowComponents}
		</BoxGroup>
	);
}
