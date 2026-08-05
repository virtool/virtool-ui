import { mkdtemp, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { isAbsolute, join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { WorkflowError } from "./errors";
import { createWorkPath } from "./workPath";

async function makeTempDir(): Promise<string> {
	return mkdtemp(join(tmpdir(), "vt-work-path-"));
}

describe("createWorkPath", () => {
	it("creates the directory when it does not exist", async () => {
		const path = join(await makeTempDir(), "work");

		const created = await createWorkPath(path);

		expect(created).toBe(path);
		expect(await readdir(created)).toEqual([]);
	});

	it("empties an existing directory with contents", async () => {
		const path = await makeTempDir();

		await writeFile(join(path, "leftover.fq"), "stale");

		const created = await createWorkPath(path);

		expect(await readdir(created)).toEqual([]);
	});

	it("returns an absolute path when given a relative one", async () => {
		const target = join(await makeTempDir(), "work");

		const created = await createWorkPath(relative(process.cwd(), target));

		expect(isAbsolute(created)).toBe(true);
		expect(created).toBe(target);
	});

	// The path comes from an environment variable and this function deletes it
	// unconditionally, so the guard matters more than the two lines it costs.
	it("refuses the filesystem root", async () => {
		await expect(createWorkPath("/")).rejects.toThrow(WorkflowError);
		await expect(createWorkPath("/")).rejects.toThrow(
			/has no parent directory/,
		);
	});

	it.each(["", "   "])("refuses a blank path", async (path) => {
		await expect(createWorkPath(path)).rejects.toThrow(WorkflowError);
		await expect(createWorkPath(path)).rejects.toThrow(/blank work path/);
	});
});
