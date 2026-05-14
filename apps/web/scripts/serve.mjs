import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "dist", "client");

const host = process.env.VT_UI_HOST ?? "0.0.0.0";
const port = Number(process.env.VT_UI_PORT ?? 9900);

const assets = sirv(root, {
	single: "_shell.html",
	dev: false,
	etag: true,
});

createServer(assets).listen(port, host, () => {
	console.log(`serving ${root} on http://${host}:${port}`);
});
