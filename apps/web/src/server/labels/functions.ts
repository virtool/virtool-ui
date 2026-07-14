import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { authenticated } from "../auth/policy";
import { db } from "../db/pg";
import {
	createLabel as createLabelImpl,
	deleteLabel as deleteLabelImpl,
	findLabels as findLabelsImpl,
	getLabel as getLabelImpl,
	LabelConflictError,
	LabelNotFoundError,
	updateLabel as updateLabelImpl,
} from "./data";

const colorSchema = z
	.string()
	.regex(/^#?[0-9a-fA-F]{6}$/, "Color must be a hex color.");

function normalizeColor(color: string): string {
	return color.startsWith("#") ? color : `#${color}`;
}

function normalizeValues<T extends { color?: string }>(values: T): T {
	if (values.color === undefined) {
		return values;
	}
	return { ...values, color: normalizeColor(values.color) };
}

const labelValuesSchema = z.object({
	color: colorSchema,
	description: z.string().default(""),
	name: z.string().min(1),
});

const labelIdSchema = z.object({
	labelId: z.number().int().positive(),
});

const findLabelsSchema = z.object({ term: z.string().default("") }).optional();

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// LabelNotFoundError / LabelConflictError imports it references — from the
// client bundle. A plain top-level helper would pin ./data and its postgres
// transitive dependency in the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof LabelNotFoundError) {
		setResponseStatus(404);
		throw new Error("Label not found.");
	}
	if (err instanceof LabelConflictError) {
		setResponseStatus(409);
		throw new Error("Label name already exists.");
	}
	throw err;
});

export const findLabels = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(findLabelsSchema)
	.handler(async ({ data }) => findLabelsImpl(db, data?.term ?? ""));

export const getLabel = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(labelIdSchema)
	.handler(async ({ data }) => {
		try {
			return await getLabelImpl(db, data.labelId);
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const createLabel = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(labelValuesSchema)
	.handler(async ({ data }) => {
		try {
			const label = await createLabelImpl(db, normalizeValues(data));
			setResponseStatus(201);
			return label;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const updateLabel = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(labelIdSchema.extend(labelValuesSchema.partial().shape))
	.handler(async ({ data }) => {
		const { labelId, ...values } = data;
		try {
			return await updateLabelImpl(db, labelId, normalizeValues(values));
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});

export const deleteLabel = createServerFn({ method: "POST" })
	.middleware([authenticated()])
	.validator(labelIdSchema)
	.handler(async ({ data }) => {
		try {
			await deleteLabelImpl(db, data.labelId);
			setResponseStatus(204);
			return null;
		} catch (err) {
			return rethrowAsHttp(err);
		}
	});
