import { mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { WorkflowError } from "./errors";

/**
 * Empty and recreate the per-run work directory, returning its absolute path.
 *
 * There is no cleanup at the end of a run: the pod is destroyed instead, and
 * process exit reclaims everything.
 *
 * @throws {WorkflowError} when the path is blank or resolves somewhere with no
 *   parent directory.
 */
export async function createWorkPath(path: string): Promise<string> {
	// This function unconditionally deletes its target and the target comes from
	// an environment variable, so the guard is worth more than the two lines it
	// costs. Python has none.
	if (path.trim() === "") {
		throw new WorkflowError("refusing to use a blank work path");
	}

	const resolved = resolve(path);

	if (dirname(resolved) === resolved) {
		throw new WorkflowError(
			`refusing to use ${resolved} as a work path: it has no parent directory`,
		);
	}

	await rm(resolved, { recursive: true, force: true });
	await mkdir(resolved, { recursive: true });

	return resolved;
}
