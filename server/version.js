const superagent = require("superagent");
const semver = require("semver");

async function verifyAPIVersion(minVersion, apiUrl) {
    const response = await superagent.get(apiUrl).then(res => res.body);

    if (!semver.gte(response.version, minVersion)) {
        console.error(
            `API version ${response.version} is not compatible with this version of the UI. Please update the API to at least ${minVersion}`,
        );
        process.exit(1);
    }
}

module.exports = verifyAPIVersion;
