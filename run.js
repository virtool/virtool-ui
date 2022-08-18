const express = require("express");
const { program } = require("commander");
const { defaultPath } = require("./server/routes");
const { applyCSPHeader } = require("./server/csp");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { logging } = require("./server/logging");
const path = require("path");
const { formatTemplateOptions } = require("./server/templateOptions");

program
  .option(
    "-p, --port <port>",
    "Port to listen on",
    process.env.VT_UI_PORT || 9900
  )
  .option(
    "-H, --host <host>",
    "Host to listen on",
    process.env.VT_UI_HOST || "localhost"
  )
  .option(
    "-a, --api-url <url>",
    "URL to make API requests against",
    process.env.VT_UI_API_URL || "http://localhost:9950"
  )
  .option(
    "-P, --use-proxy [bool]",
    "Use proxy to make API requests",
    process.env.VT_UI_USE_PROXY || false
  )
  .option(
    "--sentry-dsn <DSN>",
    "DSN for sentry logging",
    process.env.VT_UI_SENTRY_DSN ||
      "https://d9ea493cb0f34ad4a141da5506e6b03b@sentry.io/220541"
  )
  .option(
    "--use-b2c [bool]",
    "Allow usage of B2C for authentication",
    process.env.VT_UI_USE_B2C || false
  )
  .option(
    "--b2c-userflow <b2c_userflow>",
    "Name of b2c login userflow",
    process.env.VT_UI_B2C_USERFLOW || ""
  )
  .option(
    "--b2c-tenant <b2c_tenant>",
    "Name of b2c tenant",
    process.env.VT_UI_B2C_TENANT || ""
  )
  .option(
    "--b2c-client-id <b2c_client_id>",
    "The frontend b2c application clientId",
    process.env.VT_UI_B2C_CLIENT_ID || ""
  )
  .option(
    "--b2c-scope <b2c_scope>",
    "The B2C backend api scope",
    process.env.VT_UI_B2C_SCOPE || ""
  )
  .option(
    "--b2c-api-client-id <b2c_api_client_id>",
    "The backend api's B2C client id",
    process.env.VT_UI_B2C_API_CLIENT_ID || ""
  );

program.parse(process.argv);

const options = program.opts();

const app = express();

app.disable("x-powered-by");
if (options.useProxy) {
  app.use(
    createProxyMiddleware(["/api", "/ws"], {
      target: options.apiUrl,
      ws: true,
      pathRewrite: { "/api": "" },
    })
  );

  console.log(`Proxying API requests to ${options.apiUrl}`);
}

const templateOptions = formatTemplateOptions(options);

app.use([applyCSPHeader(options.b2cTenant), logging]);
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "dist"));
app.locals.delimiter = "#";

app.get(
  /\.(?:js|map|ico|svg)$/,
  express.static(path.join(__dirname, "dist"), {
    maxAge: 31536000000,
  })
);

app.get("*", defaultPath(templateOptions));

app.listen(options.port, options.host, () => {
  console.log(`Listening at http://${options.host}:${options.port}`);
});
