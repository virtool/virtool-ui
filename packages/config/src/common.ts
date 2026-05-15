import { z } from "zod";

export const boolFromEnv = z
	.union([z.string(), z.boolean(), z.undefined()])
	.transform((v) => {
		if (typeof v === "boolean") return v;
		if (v === undefined || v === "") return false;
		const lowered = v.toLowerCase();
		return lowered === "1" || lowered === "true" || lowered === "yes";
	});

export const intFromEnv = z
	.union([z.string(), z.number()])
	.transform((v, ctx) => {
		const n = typeof v === "number" ? v : Number(v);
		if (!Number.isInteger(n)) {
			ctx.addIssue({ code: "custom", message: "must be an integer" });
			return z.NEVER;
		}
		return n;
	});
