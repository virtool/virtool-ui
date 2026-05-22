import mongoose from "mongoose";
import { config } from "../config";
import { logger } from "../logger";

const MINIMUM_MONGO_VERSION = [6, 0, 0] as const;

let connected = false;

/** Connect to MongoDB via mongoose. Idempotent across HMR. */
export async function connectMongo(): Promise<void> {
	if (connected) {
		return;
	}

	await mongoose.connect(config.mongodbUrl);
	await assertMongoVersion();
	connected = true;
}

async function assertMongoVersion(): Promise<void> {
	const admin = mongoose.connection.db?.admin();
	if (!admin) {
		throw new Error("MongoDB connection is not ready");
	}

	const { version, versionArray } = (await admin.buildInfo()) as {
		version: string;
		versionArray: number[];
	};

	if (compareVersions(versionArray, MINIMUM_MONGO_VERSION) < 0) {
		throw new Error(
			`MongoDB ${versionArray.slice(0, 3).join(".")} is below the required minimum ${MINIMUM_MONGO_VERSION.join(".")}`,
		);
	}

	logger.info({ version }, "found mongo");
}

function compareVersions(a: readonly number[], b: readonly number[]): number {
	for (let i = 0; i < b.length; i++) {
		const ai = a[i] ?? 0;
		const bi = b[i] ?? 0;
		if (ai !== bi) {
			return ai - bi;
		}
	}
	return 0;
}

void connectMongo().catch((err) => {
	logger.warn({ err }, "could not connect to mongo");
});

// Re-export models for convenience: import paths like `../db/mongo` resolve to
// this file (not the sibling `mongo/` directory) when both exist.
export * from "./mongo/index";
export { mongoose };
