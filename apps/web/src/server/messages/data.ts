import type { UserNested } from "@users/types";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import { instanceMessages, type MessageColor } from "../db/schema/messages";
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

type MessageJoinRow = {
	id: number;
	active: boolean | null;
	color: MessageColor;
	message: string | null;
	createdAt: Date | null;
	updatedAt: Date | null;
	user: UserNested;
};

const messageSelect = {
	id: instanceMessages.id,
	active: instanceMessages.active,
	color: instanceMessages.color,
	message: instanceMessages.message,
	createdAt: instanceMessages.createdAt,
	updatedAt: instanceMessages.updatedAt,
	user: {
		id: users.id,
		handle: users.handle,
	},
} as const;

function toMessage(row: MessageJoinRow): Message {
	return {
		id: row.id,
		active: row.active ?? false,
		color: row.color,
		message: row.message ?? "",
		created_at: row.createdAt?.toISOString() ?? "",
		updated_at: row.updatedAt?.toISOString() ?? "",
		user: row.user,
	};
}

export async function findMessage(): Promise<Message | null> {
	const [row] = await db
		.select(messageSelect)
		.from(instanceMessages)
		.innerJoin(users, eq(users.id, instanceMessages.userId))
		.where(eq(instanceMessages.active, true))
		.limit(1);

	return row ? toMessage(row) : null;
}

export async function findMessages(): Promise<Message[]> {
	const rows = await db
		.select(messageSelect)
		.from(instanceMessages)
		.innerJoin(users, eq(users.id, instanceMessages.userId))
		.orderBy(desc(instanceMessages.createdAt));

	return rows.map(toMessage);
}

async function getMessageById(id: number): Promise<Message> {
	const [row] = await db
		.select(messageSelect)
		.from(instanceMessages)
		.innerJoin(users, eq(users.id, instanceMessages.userId))
		.where(eq(instanceMessages.id, id))
		.limit(1);

	if (!row) {
		throw new MessageNotFoundError();
	}

	return toMessage(row);
}

export async function createMessage(
	message: string,
	color: MessageColor,
	userId: number,
): Promise<Message> {
	const now = new Date();
	const row = takeFirstOrThrow(
		await db
			.insert(instanceMessages)
			.values({
				active: false,
				color,
				message,
				createdAt: now,
				updatedAt: now,
				userId,
			})
			.returning({ id: instanceMessages.id }),
	);

	await emit("messages", row.id, "create");

	return getMessageById(row.id);
}

export async function updateMessage(
	id: number,
	values: { message?: string; color?: MessageColor },
	userId: number,
): Promise<Message> {
	const update: Partial<typeof instanceMessages.$inferInsert> = {
		userId,
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
		.returning({ id: instanceMessages.id });

	if (!row) {
		throw new MessageNotFoundError();
	}

	await emit("messages", row.id, "update");

	return getMessageById(row.id);
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
			.returning({ id: instanceMessages.id });

		if (!updated) {
			throw new MessageNotFoundError();
		}

		return updated;
	});

	await emit("messages", row.id, "update");

	return getMessageById(row.id);
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
