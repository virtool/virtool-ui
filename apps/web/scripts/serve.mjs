import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "dist", "client");

const host = process.env.VT_UI_HOST ?? "0.0.0.0";
const port = Number(process.env.VT_UI_PORT ?? 9900);

const shell = readFileSync(resolve(root, "_shell.html"), "utf8");

const cspDirectives = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	"font-src 'self'",
	"img-src 'self' data:",
	"connect-src 'self' *.sentry.io",
	"style-src 'self' 'unsafe-inline'",
];

const assets = sirv(root, { dev: false, etag: true });

function serveShell(_req, res) {
	const nonce = randomBytes(16).toString("base64");
	const html = shell.replace(/<script(?=[\s>])/g, `<script nonce="${nonce}"`);
	const csp = [...cspDirectives, `script-src 'self' 'nonce-${nonce}'`].join(
		"; ",
	);
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", csp);
	res.setHeader("Cache-Control", "no-store");
	res.end(html);
}

createServer((req, res) => {
	assets(req, res, () => serveShell(req, res));
}).listen(port, host, () => {
	console.log(`serving ${root} on http://${host}:${port}`);
});
