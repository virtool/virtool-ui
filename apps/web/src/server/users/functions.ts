import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireAdminRole, requireSession } from "../auth/middleware";
import { db } from "../db/pg";
import {
	createUser as createUserImpl,
	findUsers as findUsersImpl,
	GroupMembershipError,
	getAdministratorRole as getAdministratorRoleImpl,
	getUser as getUserImpl,
	listAdministratorRoles as listAdministratorRolesImpl,
	setAdministratorRole as setAdministratorRoleImpl,
	UserConflictError,
	UserNotFoundError,
	updateUser as updateUserImpl,
} from "./data";

const administratorRoleSchema = z.enum([
	"full",
	"settings",
	"spaces",
	"users",
	"base",
]);

const userIdSchema = z.object({
	userId: z.number().int().positive(),
});

const findUsersSchema = z
	.object({
		term: z.string().default(""),
		page: z.number().int().positive().default(1),
		per_page: z.number().int().positive().max(100).default(25),
		administrator: z.boolean().optional(),
		active: z.boolean().default(true),
	})
	.optional();

const createUserSchema = z.object({
	handle: z.string().trim().min(1),
	password: z.string().min(1),
	forceReset: z.boolean().default(false),
});

const updateUserSchema = z.object({
	userId: z.number().int().positive(),
	active: z.boolean().optional(),
	force_reset: z.boolean().optional(),
	handle: z.string().trim().min(1).optional(),
	password: z.string().min(1).optional(),
	groups: z.array(z.number().int().positive()).optional(),
	primary_group: z.number().int().positive().nullable().optional(),
});

const accountHandleSchema = z.object({
	handle: z.string().trim().min(1),
});

// Reserved handle the Python service forbids; rejected before hitting the
// database so we return a clear message rather than a unique-constraint error.
// Trim defensively so whitespace-padded variants like " virtool" can't slip
// past the check even if a caller skips the schema's trim.
function checkReservedHandle(handle: string): void {
	if (handle.trim().toLowerCase() === "virtool") {
		setResponseStatus(400);
		throw new Error("Reserved user name: virtool");
	}
}

const setAdministratorRoleSchema = z.object({
	userId: z.number().int().positive(),
	role: administratorRoleSchema.nullable(),
});

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// domain-error imports it references — from the client bundle. A plain
// top-level helper would pin ./data and its postgres transitive dependency in
// the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof UserNotFoundError) {
		setResponseStatus(404);
		throw new Error("User not found.");
	}
	if (err instanceof UserConflictError) {
		setResponseStatus(409);
		throw new Error("User already exists.");
	}
	if (err instanceof GroupMembershipError) {
		setResponseStatus(400);
		throw new Error("User is not a member of group.");
	}
	throw err;
});

export const listAdministratorRoles = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireAdminRole(await requireSession(), "base");
		return listAdministratorRolesImpl();
	},
);

export const findUsers = createServerFn({ method: "GET" })
	.inputValidator(findUsersSchema)
	.handler(async ({ data }) => {
		await requireAdminRole(await requireSession(), "users");
		return findUsersImpl(db, {
			term: data?.term ?? "",
			page: data?.page ?? 1,
			perPage: data?.per_page ?? 25,
			administrator: data?.administrator,
			active: data?.active ?? true,
		});
	});

export const getUser = createServerFn({ method: "GET" })
	.inputValidator(userIdSchema)
	.handler(async ({ data }) => {
		await requireAdminRole(await requireSession(), "users");
		try {
			return await getUserImpl(db, data.userId);
		} catch (err) {
			// `throw` keeps the handler's inferred return type `User` rather than
			// `User | undefined`, so suspense consumers get a non-nullable user.
			throw rethrowAsHttp(err);
		}
	});

export const createUser = createServerFn({ method: "POST" })
	.inputValidator(createUserSchema)
	.handler(async ({ data }) => {
		await requireAdminRole(await requireSession(), "users");

		checkReservedHandle(data.handle);

		try {
			const user = await createUserImpl(db, {
				handle: data.handle,
				password: data.password,
				forceReset: data.forceReset,
			});
			setResponseStatus(201);
			return user;
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const updateUser = createServerFn({ method: "POST" })
	.inputValidator(updateUserSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		await requireAdminRole(session, "users");

		// Editing a user who is themselves an administrator requires the full
		// role, mirroring the privilege check in the Python service.
		const targetRole = await getAdministratorRoleImpl(db, data.userId);
		if (targetRole !== null) {
			await requireAdminRole(session, "full");
		}

		const { userId, ...values } = data;
		if (values.handle !== undefined) {
			checkReservedHandle(values.handle);
		}
		try {
			return await updateUserImpl(db, userId, values);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const updateAccountHandle = createServerFn({ method: "POST" })
	.inputValidator(accountHandleSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();

		checkReservedHandle(data.handle);

		try {
			return await updateUserImpl(db, session.userId, {
				handle: data.handle,
			});
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const setAdministratorRole = createServerFn({ method: "POST" })
	.inputValidator(setAdministratorRoleSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		await requireAdminRole(session, "full");

		if (session.userId === data.userId) {
			setResponseStatus(400);
			throw new Error("Cannot change own role");
		}

		try {
			return await setAdministratorRoleImpl(db, data.userId, data.role);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});
