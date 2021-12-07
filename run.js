const express = require("express");
const { program } = require("commander");
const { staticPath, defaultPath } = require("./server/routes");
const { applyCSPHeader } = require("./server/csp");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { logging } = require("./server/logging");

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
      pathRewrite: { "/api/": "/" },
    })
  );

  console.log(`Proxying API requests to ${options.apiUrl}`);
}

app.use([applyCSPHeader, logging]);

app.get(/\.(?:js|map|ico)$/, staticPath);
app.get("*", defaultPath);

app.listen(options.port, options.host, () => {
  console.log(`Listening at http://${options.host}:${options.port}`);
});
