const express = require("express");
const { backendProxy } = require("./server/Proxy");
const { JSPath, DefaultPath } = require("./server/Routes");
const { applyCSPHeader } = require("./server/CSP");

const app = express();
const port = 3000;

app.use([backendProxy, applyCSPHeader]);
app.get(/.*\.(js|map)$/, JSPath);
app.get("*", DefaultPath);

app.listen(port, () => {
  console.log(`virtool-ui listening at http://localhost:${port}`);
});
