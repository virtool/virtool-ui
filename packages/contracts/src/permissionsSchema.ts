import { z } from "zod";
import { PERMISSION_NAMES, type Permission } from "./permissions";

/**
 * Zod schema validating a full set of permission flags. Kept in its own module
 * so importing the runtime `PERMISSION_NAMES` tuple never pulls zod into a
 * bundle that only needs the permission names or types.
 */
export const permissionsSchema = z.object(
	Object.fromEntries(PERMISSION_NAMES.map((name) => [name, z.boolean()])),
) as z.ZodObject<Record<Permission, z.ZodBoolean>>;
