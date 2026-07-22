import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { authenticated, permission } from "../auth/policy";
import { db } from "../db/pg";
import { ClientError } from "../errors";
import { storage } from "../storage";
import {
	deleteUpload as deleteUploadImpl,
	findUploads as findUploadsImpl,
	UPLOAD_TYPES,
	UploadNotFoundError,
	UploadReservedError,
} from "./data";

// The upload endpoint itself is not a server function — it streams a multi-GB
// request body and is posted to with XMLHttpRequest so the client can report
// progress. It lives in the `/uploads` route (`@server/uploads/upload`).

const findUploadsSchema = z
	.object({
		upload_type: z.enum(UPLOAD_TYPES).optional(),
		page: z.number().int().positive().default(1),
		per_page: z.number().int().positive().max(100).default(25),
		user: z.number().int().positive().optional(),
	})
	.optional();

const uploadIdSchema = z.object({
	id: z.number().int().positive(),
});

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// UploadNotFoundError / UploadReservedError imports it references — from the
// client bundle. A plain top-level helper would pin ./data and its postgres
// transitive dependency in the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof UploadNotFoundError) {
		setResponseStatus(404);
		throw new ClientError("Upload not found.");
	}
	if (err instanceof UploadReservedError) {
		setResponseStatus(409);
		throw new ClientError("Upload is reserved and in use.");
	}
	throw err;
});

export const findUploads = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(findUploadsSchema)
	.handler(async ({ data }) =>
		findUploadsImpl(
			db,
			data?.upload_type,
			data?.page ?? 1,
			data?.per_page ?? 25,
			data?.user,
		),
	);

export const deleteUpload = createServerFn({ method: "POST" })
	.middleware([permission("remove_file")])
	.validator(uploadIdSchema)
	.handler(async ({ data }) => {
		try {
			await deleteUploadImpl(db, storage, data.id);
			setResponseStatus(204);
			return null;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});
