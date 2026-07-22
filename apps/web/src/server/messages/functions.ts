import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { bannerColors } from "@virtool/contracts";
import { z } from "zod";
import { adminRole, authenticated } from "../auth/policy";
import { db } from "../db/pg";
import { ClientError } from "../errors";
import {
	clearActiveMessage as clearActiveMessageImpl,
	createMessage as createMessageImpl,
	deleteMessage as deleteMessageImpl,
	findMessage as findMessageImpl,
	findMessages as findMessagesImpl,
	MessageNotFoundError,
	setActiveMessage as setActiveMessageImpl,
	updateMessage as updateMessageImpl,
} from "./data";

const colorSchema = z.enum(bannerColors);

const idSchema = z.object({ id: z.number().int().positive() });

const createMessageSchema = z.object({
	message: z.string().min(1, "Message cannot be empty."),
	color: colorSchema,
});

const updateMessageSchema = z
	.object({
		id: z.number().int().positive(),
		message: z.string().min(1, "Message cannot be empty.").optional(),
		color: colorSchema.optional(),
	})
	.refine((data) => data.message !== undefined || data.color !== undefined, {
		message: "At least one of `message` or `color` must be provided.",
	});

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// MessageNotFoundError import it references — from the client bundle.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof MessageNotFoundError) {
		setResponseStatus(404);
		throw new ClientError("Message not found.");
	}
	throw err;
});

export const findMessage = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.handler(async () => findMessageImpl(db));

export const findMessages = createServerFn({ method: "GET" })
	.middleware([adminRole("settings")])
	.handler(async () => findMessagesImpl(db));

export const createMessage = createServerFn({ method: "POST" })
	.middleware([adminRole("settings")])
	.validator(createMessageSchema)
	.handler(async ({ context, data }) => {
		const message = await createMessageImpl(
			db,
			data.message,
			data.color,
			context.session.userId,
		);
		setResponseStatus(201);
		return message;
	});

export const updateMessage = createServerFn({ method: "POST" })
	.middleware([adminRole("settings")])
	.validator(updateMessageSchema)
	.handler(async ({ context, data }) => {
		try {
			return await updateMessageImpl(
				db,
				data.id,
				{ message: data.message, color: data.color },
				context.session.userId,
			);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const deleteMessage = createServerFn({ method: "POST" })
	.middleware([adminRole("settings")])
	.validator(idSchema)
	.handler(async ({ data }) => {
		try {
			await deleteMessageImpl(db, data.id);
			setResponseStatus(204);
			return null;
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const setActiveMessage = createServerFn({ method: "POST" })
	.middleware([adminRole("settings")])
	.validator(idSchema)
	.handler(async ({ data }) => {
		try {
			return await setActiveMessageImpl(db, data.id);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const clearActiveMessage = createServerFn({ method: "POST" })
	.middleware([adminRole("settings")])
	.handler(async () => {
		await clearActiveMessageImpl(db);
		return null;
	});
