import express from "express";
import path from "node:path";
import { createCspMiddleware } from "./csp";
import { loggingMiddleware } from "./logging.js";
import { parseOptions } from "./options";
import { createDefaultRouteHandler } from "./routes";
import { verifyApiVersion } from "./version";

async function main() {
    const options = parseOptions(process.argv);

    await verifyApiVersion(options.apiUrl);

    const app = express();

    app.disable("x-powered-by");
    app.use([createCspMiddleware(options.b2cTenant), loggingMiddleware]);
    app.set("views", path.join("dist"));
    app.locals.delimiter = "#";

    app.get(
        /\.(?:js|map|ico|svg|css)$/,
        express.static(path.join("dist"), {
            maxAge: 31536000000,
        }),
    );

    app.get("*", createDefaultRouteHandler(options));

    app.listen(options.port, options.host, () => {
        console.log(`Listening at http://${options.host}:${options.port}`);
    });
}

main();
