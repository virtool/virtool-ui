import { emptyPermissions, type Permissions } from "@virtool/contracts";

/**
 * Create permissions object with default false values
 *
 * @param permissions values to override the default automatically generated values
 * @returns Permissions object with fake data
 */
export function createFakePermissions(
	permissions?: Partial<Permissions>,
): Permissions {
	return {
		...emptyPermissions(),
		...permissions,
	};
}
