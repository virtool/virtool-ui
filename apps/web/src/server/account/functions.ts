import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { db } from "../db/pg";
import { AccountNotFoundError, getAccount as getAccountImpl } from "./data";

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// AccountNotFoundError import it references — from the client bundle. A plain
// top-level helper would pin ./data and its postgres transitive dependency in
// the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof AccountNotFoundError) {
		setResponseStatus(404);
		throw new Error("Account not found.");
	}
	throw err;
});

// Authenticated by default — not listed in the middleware `exceptions`, so the
// global authentication middleware resolves the session and exposes it as
// `context.session` before this handler runs. No `inputValidator`: the user id
// comes from the session, never from the caller.
export const getAccount = createServerFn({ method: "GET" }).handler(
	async ({ context }) => {
		try {
			return await getAccountImpl(db, context.session.userId);
		} catch (err) {
			await rethrowAsHttp(err);
		}
	},
);
