import type { UserNested } from "@users/types";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/pg";
import {
	type InstanceMessageRow,
	instanceMessages,
} from "../db/schema/messages";
import { users } from "../db/schema/users";
import { emit } from "../events/emit";

/** An administrative instance message displayed to all logged-in users. */
export type Message = {
	id: number;
	active: boolean;
	color: string;
	message: string;
	created_at: string;
	updated_at: string;
	user: UserNested;
};

async function lookupUser(userIdText: string | null): Promise<UserNested> {
	const userId =
		userIdText === null ? Number.NaN : Number.parseInt(userIdText, 10);
	if (Number.isNaN(userId)) {
		return { id: 0, handle: "" };
	}

	const [row] = await db
		.select({ id: users.id, handle: users.handle })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return row ?? { id: 0, handle: "" };
}

function toMessage(row: InstanceMessageRow, user: UserNested): Message {
	return {
		id: row.id,
		active: row.active ?? false,
		color: row.color,
		message: row.message ?? "",
		created_at: row.createdAt?.toISOString() ?? "",
		updated_at: row.updatedAt?.toISOString() ?? "",
		user,
	};
}

export async function findMessage(): Promise<Message | null> {
	const [row] = await db
		.select()
		.from(instanceMessages)
		.orderBy(desc(instanceMessages.id))
		.limit(1);

	if (!row || row.active === false) {
		return null;
	}

	const user = await lookupUser(row.user);
	return toMessage(row, user);
}

export async function setMessage(
	message: string,
	userId: number,
): Promise<Message> {
	const now = new Date();
	const [row] = await db
		.insert(instanceMessages)
		.values({
			active: message.trim().length > 0,
			color: "red",
			message,
			createdAt: now,
			updatedAt: now,
			user: String(userId),
		})
		.returning();

	await emit("messages", row.id, "create");

	const user = await lookupUser(row.user);
	return toMessage(row, user);
}
