import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminRole, requireSession } from "../auth/middleware";
import {
	findMessage as findMessageImpl,
	setMessage as setMessageImpl,
} from "./data";

const setMessageSchema = z.object({
	message: z.string().min(1),
});

export const findMessage = createServerFn({ method: "GET" }).handler(async () =>
	findMessageImpl(),
);

export const setMessage = createServerFn({ method: "POST" })
	.inputValidator(setMessageSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		await requireAdminRole(session, "settings");
		return setMessageImpl(data.message, session.userId);
	});
