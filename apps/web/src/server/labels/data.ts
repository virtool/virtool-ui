import { asc, eq, ilike } from "drizzle-orm";
import type { PostgresError } from "postgres";
import { SampleDocument } from "../db/mongo";
import type { Db } from "../db/pg";
import { type LabelRow, labels as labelsTable } from "../db/schema/labels";
import { AppError } from "../errors";
import { emit } from "../events/emit";

/** A sample label with the count expected by the label-management UI. */
export type Label = {
	id: number;
	color: string;
	count: number;
	description: string;
	name: string;
};

/** Label fields accepted by create/update operations. */
export type LabelValues = {
	color: string;
	description: string;
	name: string;
};

/** Thrown when a requested label does not exist. */
export class LabelNotFoundError extends AppError {}

/** Thrown when a label name conflicts with an existing label. */
export class LabelConflictError extends AppError {}

function isUniqueViolation(error: unknown): boolean {
	const cause = (error as { cause?: unknown }).cause;
	return (
		(error as Partial<PostgresError>).code === "23505" ||
		(cause as Partial<PostgresError> | undefined)?.code === "23505"
	);
}

function normalizeColor(color: string | null): string {
	if (!color) {
		return "#D1D5DB";
	}
	return color.startsWith("#") ? color : `#${color}`;
}

function toLabel(row: LabelRow, count = 0): Label {
	return {
		id: row.id,
		color: normalizeColor(row.color),
		count,
		description: row.description ?? "",
		name: row.name ?? "",
	};
}

async function countSamplesByLabel(
	labelIds: number[],
): Promise<Map<number, number>> {
	if (labelIds.length === 0) {
		return new Map();
	}

	const rows = await SampleDocument.aggregate<{ _id: number; count: number }>([
		{ $match: { labels: { $in: labelIds } } },
		{ $unwind: "$labels" },
		{ $match: { labels: { $in: labelIds } } },
		{ $group: { _id: "$labels", count: { $sum: 1 } } },
	]);

	return new Map(rows.map((row) => [row._id, row.count]));
}

export async function findLabels(db: Db, term = ""): Promise<Label[]> {
	const rows = await db
		.select()
		.from(labelsTable)
		.where(term ? ilike(labelsTable.name, `%${term}%`) : undefined)
		.orderBy(asc(labelsTable.name));

	const counts = await countSamplesByLabel(rows.map((row) => row.id));

	return rows.map((row) => toLabel(row, counts.get(row.id) ?? 0));
}

export async function getLabel(db: Db, labelId: number): Promise<Label> {
	const [row] = await db
		.select()
		.from(labelsTable)
		.where(eq(labelsTable.id, labelId));

	if (!row) {
		throw new LabelNotFoundError();
	}

	const counts = await countSamplesByLabel([row.id]);
	return toLabel(row, counts.get(row.id) ?? 0);
}

export async function createLabel(db: Db, values: LabelValues): Promise<Label> {
	let row: LabelRow;
	try {
		[row] = await db.insert(labelsTable).values(values).returning();
	} catch (error) {
		if (isUniqueViolation(error)) {
			throw new LabelConflictError();
		}
		throw error;
	}

	await emit("labels", row.id, "create");

	return toLabel(row, 0);
}

export async function updateLabel(
	db: Db,
	labelId: number,
	values: Partial<LabelValues>,
): Promise<Label> {
	let row: LabelRow | undefined;
	try {
		[row] = await db
			.update(labelsTable)
			.set(values)
			.where(eq(labelsTable.id, labelId))
			.returning();
	} catch (error) {
		if (isUniqueViolation(error)) {
			throw new LabelConflictError();
		}
		throw error;
	}

	if (!row) {
		throw new LabelNotFoundError();
	}

	await emit("labels", row.id, "update");

	const counts = await countSamplesByLabel([row.id]);
	return toLabel(row, counts.get(row.id) ?? 0);
}

export async function deleteLabel(db: Db, labelId: number): Promise<void> {
	const [row] = await db
		.delete(labelsTable)
		.where(eq(labelsTable.id, labelId))
		.returning({ id: labelsTable.id });

	if (!row) {
		throw new LabelNotFoundError();
	}

	await emit("labels", row.id, "delete");
}
