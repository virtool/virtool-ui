import { randomBytes } from "node:crypto";
import {
	sentryGlobalFunctionMiddleware,
	sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import {
	createCsrfMiddleware,
	createMiddleware,
	createStart,
} from "@tanstack/react-start";

import { loginFn, logoutFn, resetPasswordFn } from "./server/auth/functions";
import { createAuthenticationMiddleware } from "./server/auth/middleware";
import { errorLoggingMiddleware } from "./server/error-logging";

// logoutFn must be exempt so stale or missing cookies can still be cleared.
const authenticationMiddleware = createAuthenticationMiddleware([
	loginFn,
	logoutFn,
	resetPasswordFn,
]);

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

// Builds one response header for served HTML documents. Each builder receives
// the per-response CSP nonce; those that don't need it ignore the argument.
// Adding a document header is a new entry in `documentHeaders`, not another
// edit to the middleware body.
type DocumentHeader = (nonce: string) => [name: string, value: string];

const documentHeaders: DocumentHeader[] = [
	(nonce) => [
		"Content-Security-Policy",
		[...cspDirectives, `script-src 'self' 'nonce-${nonce}'`].join("; "),
	],
	// Opt the document into the JS Self-Profiling API so Sentry's browser
	// profiling integration can sample. A no-op in browsers without the API
	// (Firefox, Safari), so it is safe to send unconditionally.
	() => ["Document-Policy", "js-profiling"],
	// HTML documents carry a per-request nonce and authenticated state; never
	// let a shared cache hold onto them.
	() => ["Cache-Control", "no-store"],
];

const documentHeadersMiddleware = createMiddleware().server(
	async ({ next }) => {
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
		for (const build of documentHeaders) {
			const [name, value] = build(nonce);
			headers.set(name, value);
		}
		headers.delete("content-length");

		return {
			...result,
			response: new Response(body, {
				status: response.status,
				statusText: response.statusText,
				headers,
			}),
		};
	},
);

// Server functions are same-origin RPC endpoints callable from any site.
// Scoping CSRF checks to serverFn requests avoids blocking regular page
// loads and API proxy routes that don't share the same threat model.
const csrfMiddleware = createCsrfMiddleware({
	filter: (ctx) => ctx.handlerType === "serverFn",
});

// Sentry middleware go first so request and server-function spans wrap the
// csrf/header/auth work rather than nesting inside it.
export const startInstance = createStart(() => ({
	defaultSsr: false,
	requestMiddleware: [
		sentryGlobalRequestMiddleware,
		csrfMiddleware,
		documentHeadersMiddleware,
	],
	functionMiddleware: [
		sentryGlobalFunctionMiddleware,
		errorLoggingMiddleware,
		authenticationMiddleware,
	],
}));
