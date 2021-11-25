const express = require("express");
const { backendProxy } = require("./server/Proxy");
const { staticPath, DefaultPath } = require("./server/Routes");
const { applyCSPHeader } = require("./server/CSP");

const argv = require("minimist")(process.argv.slice(2));
const app = express();

const port = argv.port || process.env.VTUI_PORT;
const backendURL = argv["backend-url"] || process.env.VTUI_BACKEND_URL;

app.use([backendProxy(backendURL), applyCSPHeader]);
app.get(/\.(?:js|map|ico)$/, staticPath);
app.get("*", DefaultPath);

app.listen(port, () => {
  console.log(`virtool-ui listening at http://localhost:${port}`);
});
