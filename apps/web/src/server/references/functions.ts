import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import type { ReferenceRight } from "@virtool/contracts";
import { z } from "zod";
import { ForbiddenError } from "../auth/middleware";
import { authenticated, permission } from "../auth/policy";
import { db } from "../db/pg";
import { ClientError } from "../errors";
import {
	addReferenceGroup as addReferenceGroupImpl,
	addReferenceUser as addReferenceUserImpl,
	checkReferenceRight,
	createReference as createReferenceImpl,
	findReferences as findReferencesImpl,
	getReference as getReferenceImpl,
	ReferenceArchivedError,
	ReferenceCloneSourceNotFoundError,
	ReferenceImportUploadNotFoundError,
	ReferenceMemberConflictError,
	ReferenceMemberNotFoundError,
	ReferenceNotFoundError,
	removeReferenceGroup as removeReferenceGroupImpl,
	removeReferenceUser as removeReferenceUserImpl,
	resolveReferenceActor,
	setReferenceArchived as setReferenceArchivedImpl,
	updateReferenceGroup as updateReferenceGroupImpl,
	updateReference as updateReferenceImpl,
	updateReferenceUser as updateReferenceUserImpl,
} from "./data";

const referenceIdSchema = z.object({
	referenceId: z.number().int().positive(),
});

const findReferencesSchema = z.object({
	page: z.number().int().positive().default(1),
	per_page: z.number().int().positive().max(100).default(25),
	term: z.string().default(""),
	archived: z.boolean().optional(),
});

const rightsSchema = z.object({
	build: z.boolean().optional(),
	modify: z.boolean().optional(),
	modifyOtu: z.boolean().optional(),
});

const createReferenceSchema = z
	.object({
		name: z.string().trim().default(""),
		description: z.string().trim().default(""),
		organism: z.string().trim().default(""),
		cloneFrom: z.number().int().positive().optional(),
		importFrom: z.number().int().positive().optional(),
	})
	.refine(
		(data) => !(data.cloneFrom !== undefined && data.importFrom !== undefined),
		{
			message: "Only one of cloneFrom or importFrom may be set.",
		},
	);

const updateReferenceSchema = z.object({
	referenceId: z.number().int().positive(),
	name: z.string().trim().min(1).optional(),
	description: z.string().optional(),
	organism: z.string().optional(),
	restrictSourceTypes: z.boolean().optional(),
	sourceTypes: z.array(z.string()).optional(),
});

const referenceUserSchema = referenceIdSchema.extend({
	userId: z.number().int().positive(),
});

const referenceGroupSchema = referenceIdSchema.extend({
	groupId: z.number().int().positive(),
});

const addReferenceUserSchema = referenceUserSchema.merge(rightsSchema);
const addReferenceGroupSchema = referenceGroupSchema.merge(rightsSchema);
const updateReferenceUserSchema = referenceUserSchema.merge(rightsSchema);
const updateReferenceGroupSchema = referenceGroupSchema.merge(rightsSchema);

// Wrapped in createServerOnlyFn so the compiler can strip these bodies — and the
// ./data imports they reference — from the client bundle. A plain top-level
// helper would pin ./data and its postgres transitive dependency in the client
// graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof ReferenceNotFoundError) {
		setResponseStatus(404);
		throw new ClientError("Reference not found.", 404);
	}
	if (err instanceof ReferenceArchivedError) {
		setResponseStatus(409);
		throw new ClientError("Reference is archived.", 409);
	}
	if (err instanceof ReferenceCloneSourceNotFoundError) {
		setResponseStatus(400);
		throw new ClientError("Source reference does not exist.", 400);
	}
	if (err instanceof ReferenceImportUploadNotFoundError) {
		setResponseStatus(400);
		throw new ClientError("Upload does not exist.", 400);
	}
	if (err instanceof ReferenceMemberNotFoundError) {
		setResponseStatus(404);
		throw new ClientError("Member not found.", 404);
	}
	if (err instanceof ReferenceMemberConflictError) {
		setResponseStatus(400);
		throw new ClientError(err.message, 400);
	}
	throw err;
});

// The `authenticated()` floor guarantees a signed-in caller; this enforces the
// per-reference right the operation needs on top of it. A full administrator
// passes every check; a missing reference surfaces as a 404 for a
// non-administrator via `checkReferenceRight`.
const authorizeReference = createServerOnlyFn(
	async (
		referenceId: number,
		userId: number,
		right: ReferenceRight,
	): Promise<void> => {
		const actor = await resolveReferenceActor(db, userId);

		if (!(await checkReferenceRight(db, referenceId, right, actor))) {
			setResponseStatus(403);
			throw new ForbiddenError();
		}
	},
);

export const findReferences = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(findReferencesSchema)
	.handler(async ({ context, data }) => {
		const actor = await resolveReferenceActor(db, context.session.userId);

		return findReferencesImpl(
			db,
			{
				page: data.page,
				perPage: data.per_page,
				term: data.term,
				archived: data.archived,
			},
			actor,
		);
	});

export const getReference = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(referenceIdSchema)
	.handler(async ({ data }) => {
		try {
			return await getReferenceImpl(db, data.referenceId);
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const createReference = createServerFn({ method: "POST" })
	.middleware([permission("create_ref")])
	.validator(createReferenceSchema)
	.handler(async ({ context, data }) => {
		try {
			const reference = await createReferenceImpl(db, {
				name: data.name,
				description: data.description,
				organism: data.organism,
				cloneFrom: data.cloneFrom,
				importFrom: data.importFrom,
				userId: context.session.userId,
			});
			setResponseStatus(201);
			return reference;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const updateReference = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(updateReferenceSchema)
	.handler(async ({ context, data }) => {
		const { referenceId, ...values } = data;
		try {
			await authorizeReference(referenceId, context.session.userId, "modify");
			return await updateReferenceImpl(db, referenceId, values);
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const archiveReference = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(referenceIdSchema)
	.handler(async ({ context, data }) => {
		try {
			await authorizeReference(
				data.referenceId,
				context.session.userId,
				"modify",
			);
			return await setReferenceArchivedImpl(db, data.referenceId, true);
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const unarchiveReference = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(referenceIdSchema)
	.handler(async ({ context, data }) => {
		try {
			await authorizeReference(
				data.referenceId,
				context.session.userId,
				"modify",
			);
			return await setReferenceArchivedImpl(db, data.referenceId, false);
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const addReferenceUser = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(addReferenceUserSchema)
	.handler(async ({ context, data }) => {
		const { referenceId, userId, ...rights } = data;
		try {
			await authorizeReference(referenceId, context.session.userId, "modify");
			const member = await addReferenceUserImpl(
				db,
				referenceId,
				userId,
				rights,
			);
			setResponseStatus(201);
			return member;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const addReferenceGroup = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(addReferenceGroupSchema)
	.handler(async ({ context, data }) => {
		const { referenceId, groupId, ...rights } = data;
		try {
			// The user-membership add checks `modify`; this closes the asymmetry with
			// the Python service, which left group-add unguarded.
			await authorizeReference(referenceId, context.session.userId, "modify");
			const member = await addReferenceGroupImpl(
				db,
				referenceId,
				groupId,
				rights,
			);
			setResponseStatus(201);
			return member;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const updateReferenceUser = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(updateReferenceUserSchema)
	.handler(async ({ context, data }) => {
		const { referenceId, userId, ...rights } = data;
		try {
			await authorizeReference(referenceId, context.session.userId, "modify");
			return await updateReferenceUserImpl(db, referenceId, userId, rights);
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const updateReferenceGroup = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(updateReferenceGroupSchema)
	.handler(async ({ context, data }) => {
		const { referenceId, groupId, ...rights } = data;
		try {
			await authorizeReference(referenceId, context.session.userId, "modify");
			return await updateReferenceGroupImpl(db, referenceId, groupId, rights);
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const removeReferenceUser = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(referenceUserSchema)
	.handler(async ({ context, data }) => {
		try {
			await authorizeReference(
				data.referenceId,
				context.session.userId,
				"modify",
			);
			await removeReferenceUserImpl(db, data.referenceId, data.userId);
			setResponseStatus(204);
			return null;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const removeReferenceGroup = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(referenceGroupSchema)
	.handler(async ({ context, data }) => {
		try {
			await authorizeReference(
				data.referenceId,
				context.session.userId,
				"modify",
			);
			await removeReferenceGroupImpl(db, data.referenceId, data.groupId);
			setResponseStatus(204);
			return null;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});
