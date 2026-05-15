import { MongoClient } from "mongodb";
import { config } from "../config";
import { logger } from "../logger";

export const client = new MongoClient(config.mongodbUrl);

export const db = client.db();

/** The MongoDB client connected to the configured cluster. */
export type MongoClientType = typeof client;

/** The default MongoDB database derived from the connection URL. */
export type MongoDb = typeof db;

void client.connect().then(
	async () => {
		try {
			const info = await db.admin().serverInfo();
			logger.info({ version: info.version }, "found mongo");
		} catch (err) {
			logger.warn({ err }, "could not read mongo server version");
		}
	},
	(err) => {
		logger.warn({ err }, "could not connect to mongo");
	},
);
