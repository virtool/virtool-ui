import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import {
	createGroup as createGroupImpl,
	deleteGroup as deleteGroupImpl,
	findGroups as findGroupsImpl,
	GroupConflictError,
	GroupNotFoundError,
	getGroup as getGroupImpl,
	listGroups as listGroupsImpl,
	updateGroup as updateGroupImpl,
} from "./data";

const groupIdSchema = z.object({
	groupId: z.number().int().positive(),
});

const findGroupsSchema = z
	.object({
		term: z.string().default(""),
		page: z.number().int().positive().default(1),
		per_page: z.number().int().positive().max(100).default(25),
	})
	.optional();

const createGroupSchema = z.object({
	name: z.string().min(1),
});

const permissionsPatchSchema = z
	.object({
		cancel_job: z.boolean(),
		create_ref: z.boolean(),
		create_sample: z.boolean(),
		modify_hmm: z.boolean(),
		modify_subtraction: z.boolean(),
		remove_file: z.boolean(),
		remove_job: z.boolean(),
		upload_file: z.boolean(),
	})
	.partial();

const updateGroupSchema = z.object({
	groupId: z.number().int().positive(),
	name: z.string().min(1).optional(),
	permissions: permissionsPatchSchema.optional(),
});

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// GroupNotFoundError / GroupConflictError imports it references — from the
// client bundle. A plain top-level helper would pin ./data and its postgres
// transitive dependency in the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof GroupNotFoundError) {
		setResponseStatus(404);
		throw new Error("Group not found.");
	}
	if (err instanceof GroupConflictError) {
		setResponseStatus(409);
		throw new Error("Group name already exists.");
	}
	throw err;
});

export const listGroups = createServerFn({ method: "GET" }).handler(async () =>
	listGroupsImpl(),
);

export const findGroups = createServerFn({ method: "GET" })
	.validator(findGroupsSchema)
	.handler(async ({ data }) =>
		findGroupsImpl(data?.term ?? "", data?.page ?? 1, data?.per_page ?? 25),
	);

export const getGroup = createServerFn({ method: "GET" })
	.validator(groupIdSchema)
	.handler(async ({ data }) => {
		try {
			return await getGroupImpl(data.groupId);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const createGroup = createServerFn({ method: "POST" })
	.validator(createGroupSchema)
	.handler(async ({ data }) => {
		try {
			const group = await createGroupImpl(data.name);
			setResponseStatus(201);
			return group;
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const updateGroup = createServerFn({ method: "POST" })
	.validator(updateGroupSchema)
	.handler(async ({ data }) => {
		const { groupId, ...values } = data;
		try {
			return await updateGroupImpl(groupId, values);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const deleteGroup = createServerFn({ method: "POST" })
	.validator(groupIdSchema)
	.handler(async ({ data }) => {
		try {
			await deleteGroupImpl(data.groupId);
			setResponseStatus(204);
			return null;
		} catch (err) {
			rethrowAsHttp(err);
		}
	});
