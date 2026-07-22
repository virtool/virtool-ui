import type { Db } from "../db/pg";
import { createTask } from "../tasks/data";
import {
	attachInstallTask,
	fetchAndUpdateRelease,
	getUserHandle,
	HMM_INSTALL_TASK_TYPE,
	HmmInstallConflictError,
	type HmmInstalled,
	HmmReleaseError,
	isInstallInProgress,
} from "./data";

/**
 * Start an HMM install and return the pending install record.
 *
 * Mirrors the Python `HmmsData.install_update`: refuse if an install is already
 * running, refresh the release from the manifest, create the `install_hmms`
 * task the Python runner will claim, and point the status singleton at it.
 */
export async function installUpdate(
	db: Db,
	userId: number,
): Promise<HmmInstalled> {
	if (await isInstallInProgress(db)) {
		throw new HmmInstallConflictError("Install already in progress");
	}

	const release = await fetchAndUpdateRelease(db);

	if (!release) {
		throw new HmmReleaseError("Target release does not exist");
	}

	const update = await db.transaction(async (tx) => {
		const taskId = await createTask(tx, HMM_INSTALL_TASK_TYPE, {
			user_id: userId,
			release,
		});
		return attachInstallTask(tx, taskId, release, userId);
	});

	const handle = await getUserHandle(db, userId);

	return { ...update, user: { id: userId, handle } };
}
