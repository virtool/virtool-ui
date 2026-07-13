import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "../db/pg";
import { getUploads as getUploadsImpl, type Upload } from "./data";

// A selection is bounded by what a person will actually act on, and the ids
// travel in a URL. Reject an unreasonable list rather than letting it become a
// pathological IN clause.
const MAX_IDS = 100;

const getUploadsSchema = z.object({
	ids: z.array(z.number().int().positive()).max(MAX_IDS),
	type: z.enum(["reads", "reference", "subtraction"]).optional(),
});

export const getUploads = createServerFn({ method: "GET" })
	.validator(getUploadsSchema)
	.handler(async ({ data }): Promise<Upload[]> => {
		return getUploadsImpl(db, data.ids, data.type);
	});
