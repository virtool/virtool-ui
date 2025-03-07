import fs from "fs";
import { ServerOptions } from "./options";

const baseTemplateString = fs.readFileSync("dist/index.html").toString();

function createTemplateString(options: ServerOptions) {
    return baseTemplateString
        .replace("SENTRY_DSN", options.sentryDsn)
        .replace("VERSION", "unknown");
}

/**
 * Asynchronously returns index.html (virtool client entrypoint) as default path
 */
export function createDefaultRouteHandler(options: ServerOptions) {
    const template = createTemplateString(options);

    return (req, res) => {
        res.send(template.replaceAll("NONCE", res.locals.nonce));
    };
}
