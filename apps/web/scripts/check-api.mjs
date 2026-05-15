import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import semver from "semver";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
	readFileSync(resolve(__dirname, "..", "package.json"), "utf8"),
);
const minApiVersion = pkg.virtool.minApiVersion;
const apiUrl = process.env.VT_UI_API_URL ?? "http://localhost:9950";

const response = await fetch(apiUrl);
if (!response.ok) {
	console.error(`failed to reach api at ${apiUrl}: ${response.status}`);
	process.exit(1);
}

const body = await response.json();
if (!semver.gte(body.version, minApiVersion)) {
	console.error(
		`found incompatible API version ${body.version}. Require ${minApiVersion}.`,
	);
	process.exit(1);
}

console.log(`found compatible api version ${body.version}`);
