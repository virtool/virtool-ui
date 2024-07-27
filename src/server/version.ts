import fs from "fs";
import semver from "semver/preload.js";
import superagent from "superagent";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const minApiVersion = packageJson.virtool.minApiVersion;

/**
 * Verify the running API version is compatible with the UI
 *
 * @func
 * @param {string} apiUrl - the base url for the API
 */
export async function verifyApiVersion(apiUrl: string) {
    const response = await superagent.get(apiUrl).then(res => res.body);

    if (!semver.gte(response.version, minApiVersion)) {
        console.error(`Found incompatible API version ${response.version}. Require ${minApiVersion}.`);
        process.exit(1);
    }

    console.log(`Found compatible API version ${response.version}`);
}
