import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(import.meta.dirname, "../..");

// Directories the browser never reaches. `src/server` compiles as a separate
// TypeScript project and is free to read process.env; tests are never bundled.
const EXCLUDED_DIRECTORIES = new Set(["__tests__", "server", "tests"]);

// Server entry points that live at the top of `src` rather than under
// `src/server`. Both are excluded from the app TypeScript project too.
const EXCLUDED_FILES = new Set(["instrument.server.ts", "server.ts"]);

const EXTENSIONS = new Set([".ts", ".tsx"]);

// Matches a reference to the whole env object rather than one key of it. Vite
// substitutes those with every VITE_- and VT_-prefixed variable present at
// build time, so one such reference anywhere in the client graph serializes
// server secrets into the bundle. A member access inlines only the key it
// names, which is what client code should use.
const WHOLE_ENV_OBJECT = /import\.meta\.env(?!\s*\.)/;

async function findClientSources(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });

	const found = await Promise.all(
		entries.map(async (entry) => {
			const full = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				return EXCLUDED_DIRECTORIES.has(entry.name)
					? []
					: findClientSources(full);
			}

			if (EXCLUDED_FILES.has(path.relative(SRC, full))) {
				return [];
			}

			return EXTENSIONS.has(path.extname(entry.name)) ? [full] : [];
		}),
	);

	return found.flat();
}

describe("client sources", () => {
	it("read named environment variables rather than the whole env object", async () => {
		const files = await findClientSources(SRC);

		expect(files.length).toBeGreaterThan(0);

		const offenders = (
			await Promise.all(
				files.map(async (file) => {
					const source = await readFile(file, "utf8");
					return WHOLE_ENV_OBJECT.test(source)
						? path.relative(SRC, file)
						: null;
				}),
			)
		).filter((file) => file !== null);

		expect(offenders).toEqual([]);
	});
});
