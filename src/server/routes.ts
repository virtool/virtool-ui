import fs from "fs";
import { ServerOptions } from "./options";

const baseTemplateString = fs.readFileSync("dist/index.html").toString();

function createTemplateString(options: ServerOptions) {
    const b2cEnabled = Boolean(options.b2cUserflow);

    return baseTemplateString
        .replace('"B2C_ENABLED"', b2cEnabled ? "true" : "false")
        .replace("SENTRY_DSN", options.sentryDsn)
        .replace("VERSION", "unknown")
        .replace("B2C_API_CLIENT_ID", options.b2cApiClientId)
        .replace("B2C_CLIENT_ID", options.b2cClientId)
        .replace("B2C_SCOPE", options.b2cScope)
        .replace("B2C_TENANT", options.b2cTenant)
        .replace("B2C_USER_FLOW", options.b2cUserflow);
}

/**
 * Asynchronously returns index.html (virtool client entrypoint) as default path
 */
export function createDefaultRouteHandler(options: ServerOptions) {
    const useB2c =
        options.b2cUserflow || options.b2cTenant || options.b2cClientId || options.b2cScope || options.b2cApiClientId;

    if (
        useB2c &&
        !(options.b2cUserflow && options.b2cTenant && options.b2cClientId && options.b2cScope && options.b2cApiClientId)
    ) {
        console.error(
            "Aborting server start: b2c-userflow, b2c-tenant, b2c-clientId and b2c-scope must all be set to enable authentication with b2c"
        );
        process.exit(0);
    }

    const template = createTemplateString(options);

    return (req, res) => {
        res.send(template.replaceAll("NONCE", res.locals.nonce));
    };
}
