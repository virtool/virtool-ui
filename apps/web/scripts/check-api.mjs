import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
	readFileSync(resolve(here, "..", "package.json"), "utf8"),
);
const minApiVersion = pkg.virtool.minApiVersion;
const apiUrl = process.env.VT_UI_API_URL ?? "http://localhost:9950";

const response = await fetch(apiUrl);
if (!response.ok) {
	process.exit(1);
}

const body = await response.json();
if (!gte(body.version, minApiVersion)) {
	process.exit(1);
}

// Minimal semver "greater-than-or-equal" for `major.minor.patch` strings,
// ignoring prerelease/build suffixes. Inlined to avoid pulling `semver` into
// the runtime image when the Nitro bundle already contains everything else.
function gte(a, b) {
	const parse = (s) =>
		s
			.split("-", 1)[0]
			.split(".", 3)
			.map((n) => Number.parseInt(n, 10) || 0);
	const [aMaj, aMin, aPat] = parse(a);
	const [bMaj, bMin, bPat] = parse(b);
	if (aMaj !== bMaj) return aMaj > bMaj;
	if (aMin !== bMin) return aMin > bMin;
	return aPat >= bPat;
}
