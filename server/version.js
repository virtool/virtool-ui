const superagent = require("superagent");
const semver = require("semver");

/**
 * Verify the running API version is compatible with the UI
 *
 * @func
 * @param {string[]} minVersion - the minimum API version required
 * @param {string} apiUrl - the base url for the API
 * @returns {N/A}
 */
async function verifyAPIVersion(minVersion, apiUrl) {
    const response = await superagent.get(apiUrl).then(res => res.body);

    if (!semver.gte(response.version, minVersion)) {
        console.error(
            `Found incompatible API version ${response.version}. Please update the API to at least ${minVersion}`,
        );
        process.exit(1);
    }

    console.log(`Found compatible API version ${response.version}, starting server...`);
}

module.exports = verifyAPIVersion;
