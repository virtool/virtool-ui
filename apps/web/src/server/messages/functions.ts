import { bannerColors } from "@banner/types";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireAdminRole, requireSession } from "../auth/middleware";
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
		throw new Error("Message not found.");
	}
	throw err;
});

export const findMessage = createServerFn({ method: "GET" }).handler(async () =>
	findMessageImpl(),
);

export const findMessages = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await requireSession();
		await requireAdminRole(session, "settings");
		return findMessagesImpl();
	},
);

export const createMessage = createServerFn({ method: "POST" })
	.validator(createMessageSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		await requireAdminRole(session, "settings");
		const message = await createMessageImpl(
			data.message,
			data.color,
			session.userId,
		);
		setResponseStatus(201);
		return message;
	});

export const updateMessage = createServerFn({ method: "POST" })
	.validator(updateMessageSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		await requireAdminRole(session, "settings");
		try {
			return await updateMessageImpl(
				data.id,
				{ message: data.message, color: data.color },
				session.userId,
			);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const deleteMessage = createServerFn({ method: "POST" })
	.validator(idSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		await requireAdminRole(session, "settings");
		try {
			await deleteMessageImpl(data.id);
			setResponseStatus(204);
			return null;
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const setActiveMessage = createServerFn({ method: "POST" })
	.validator(idSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		await requireAdminRole(session, "settings");
		try {
			return await setActiveMessageImpl(data.id);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});

export const clearActiveMessage = createServerFn({ method: "POST" }).handler(
	async () => {
		const session = await requireSession();
		await requireAdminRole(session, "settings");
		await clearActiveMessageImpl();
		return null;
	},
);
