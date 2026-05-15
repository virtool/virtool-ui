import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "../config";
import { logger } from "../logger";
import * as schema from "./schema";

export const client = postgres(config.postgresUrl);

export const db = drizzle(client, { schema });

/** Drizzle database client typed against the full schema. */
export type Db = typeof db;

/** The underlying postgres-js client used by Drizzle. */
export type PgClient = typeof client;

void client`SHOW server_version`.then(
	(rows) => {
		const version = String(rows[0]?.server_version ?? "").split(/\s+/)[0];
		logger.info({ version }, "found postgres");
	},
	(err) => {
		logger.warn({ err }, "could not read postgres server version");
	},
);
