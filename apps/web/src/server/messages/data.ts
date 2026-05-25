import type { UserNested } from "@users/types";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/pg";
import {
	type InstanceMessageRow,
	instanceMessages,
	type MessageColor,
} from "../db/schema/messages";
import { users } from "../db/schema/users";
import { AppError } from "../errors";
import { emit } from "../events/emit";

/** An administrative instance message displayed to all logged-in users. */
export type Message = {
	id: number;
	active: boolean;
	color: MessageColor;
	message: string;
	created_at: string;
	updated_at: string;
	user: UserNested;
};

/** Thrown when a requested instance message does not exist. */
export class MessageNotFoundError extends AppError {}

function parseUserId(userIdText: string | null): number | null {
	if (userIdText === null) {
		return null;
	}
	const parsed = Number.parseInt(userIdText, 10);
	return Number.isNaN(parsed) ? null : parsed;
}

async function lookupUsers(
	userIdTexts: ReadonlyArray<string | null>,
): Promise<Map<number, UserNested>> {
	const ids = Array.from(
		new Set(
			userIdTexts.map(parseUserId).filter((id): id is number => id !== null),
		),
	);

	if (ids.length === 0) {
		return new Map();
	}

	const rows = await db
		.select({ id: users.id, handle: users.handle })
		.from(users)
		.where(inArray(users.id, ids));

	return new Map(rows.map((row) => [row.id, row]));
}

async function lookupUser(userIdText: string | null): Promise<UserNested> {
	const map = await lookupUsers([userIdText]);
	const id = parseUserId(userIdText);
	if (id !== null) {
		const user = map.get(id);
		if (user) {
			return user;
		}
	}
	return { id: 0, handle: "" };
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
		.where(eq(instanceMessages.active, true))
		.limit(1);

	if (!row) {
		return null;
	}

	const user = await lookupUser(row.user);
	return toMessage(row, user);
}

export async function findMessages(): Promise<Message[]> {
	const rows = await db
		.select()
		.from(instanceMessages)
		.orderBy(desc(instanceMessages.createdAt));

	const userMap = await lookupUsers(rows.map((row) => row.user));

	return rows.map((row) => {
		const id = parseUserId(row.user);
		const user = (id !== null && userMap.get(id)) || { id: 0, handle: "" };
		return toMessage(row, user);
	});
}

export async function createMessage(
	message: string,
	color: MessageColor,
	userId: number,
): Promise<Message> {
	const now = new Date();
	const [row] = await db
		.insert(instanceMessages)
		.values({
			active: false,
			color,
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

export async function updateMessage(
	id: number,
	values: { message?: string; color?: MessageColor },
	userId: number,
): Promise<Message> {
	const update: Partial<typeof instanceMessages.$inferInsert> = {
		user: String(userId),
		updatedAt: new Date(),
	};
	if (values.color !== undefined) {
		update.color = values.color;
	}
	if (values.message !== undefined) {
		update.message = values.message;
	}

	const [row] = await db
		.update(instanceMessages)
		.set(update)
		.where(eq(instanceMessages.id, id))
		.returning();

	if (!row) {
		throw new MessageNotFoundError();
	}

	await emit("messages", row.id, "update");

	const user = await lookupUser(row.user);
	return toMessage(row, user);
}

export async function deleteMessage(id: number): Promise<void> {
	const [row] = await db
		.delete(instanceMessages)
		.where(eq(instanceMessages.id, id))
		.returning({ id: instanceMessages.id });

	if (!row) {
		throw new MessageNotFoundError();
	}

	await emit("messages", row.id, "delete");
}

export async function setActiveMessage(id: number): Promise<Message> {
	const row = await db.transaction(async (tx) => {
		await tx
			.update(instanceMessages)
			.set({ active: false })
			.where(eq(instanceMessages.active, true));

		const [updated] = await tx
			.update(instanceMessages)
			.set({ active: true })
			.where(eq(instanceMessages.id, id))
			.returning();

		if (!updated) {
			throw new MessageNotFoundError();
		}

		return updated;
	});

	await emit("messages", row.id, "update");

	const user = await lookupUser(row.user);
	return toMessage(row, user);
}

export async function clearActiveMessage(): Promise<void> {
	const rows = await db
		.update(instanceMessages)
		.set({ active: false })
		.where(eq(instanceMessages.active, true))
		.returning({ id: instanceMessages.id });

	// Any id will do — the broadcast handler re-resolves the active row via
	// findMessage().
	const resourceId = rows[0]?.id ?? 0;
	await emit("messages", resourceId, "update");
}
