const express = require("express");
const { defaultPath } = require("./server/routes");
const { applyCSPHeader } = require("./server/csp");
const { logging } = require("./server/logging");
const path = require("path");
const { formatTemplateOptions } = require("./server/templateOptions");
const verifyAPIVersion = require("./server/version");
const parseOptions = require("./server/options");

async function main() {
    const options = parseOptions(process.argv);

    await verifyAPIVersion(options.apiUrl);

    const app = express();

    app.disable("x-powered-by");
    app.use([applyCSPHeader(options.b2cTenant), logging]);
    app.set("views", path.join(__dirname, "dist"));
    app.locals.delimiter = "#";

    app.get(
        /\.(?:js|map|ico|svg|css)$/,
        express.static(path.join(__dirname, "dist"), {
            maxAge: 31536000000,
        }),
    );

    const templateOptions = formatTemplateOptions(options);
    app.get("*", defaultPath(templateOptions));

    app.listen(options.port, options.host, () => {
        console.log(`Listening at http://${options.host}:${options.port}`);
    });
}

main();
