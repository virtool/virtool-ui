import { randomBytes } from "node:crypto";
import { createMiddleware, createStart } from "@tanstack/react-start";

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

const cspNonce = createMiddleware().server(async ({ next }) => {
	const result = await next();
	const { response } = result;
	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.includes("text/html")) {
		return result;
	}

	const html = await response.text();
	const nonce = randomBytes(16).toString("base64");
	const body = html.replace(/<script(?=[\s>])/g, `<script nonce="${nonce}"`);
	const headers = new Headers(response.headers);
	headers.set(
		"Content-Security-Policy",
		[...cspDirectives, `script-src 'self' 'nonce-${nonce}'`].join("; "),
	);
	headers.set("Cache-Control", "no-store");
	headers.delete("content-length");

	return {
		...result,
		response: new Response(body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		}),
	};
});

export const startInstance = createStart(() => ({
	defaultSsr: false,
	requestMiddleware: [cspNonce],
}));
