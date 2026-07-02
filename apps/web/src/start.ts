import {
	sentryGlobalFunctionMiddleware,
	sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import {
	createFirstUserFn,
	loginFn,
	logoutFn,
	resetPasswordFn,
} from "@server/auth/functions";
import { createAuthenticationMiddleware } from "@server/auth/middleware";
import { errorLoggingMiddleware } from "@server/error-logging";
import {
	createCsrfMiddleware,
	createMiddleware,
	createStart,
} from "@tanstack/react-start";

// logoutFn must be exempt so stale or missing cookies can still be cleared.
// createFirstUserFn runs before any user or session exists.
const authenticationMiddleware = createAuthenticationMiddleware([
	createFirstUserFn,
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
type DocumentHeader = (nonce: string) => [name: string, value: string];

function buildContentSecurityPolicy(
	nonce: string,
): [name: string, value: string] {
	return [
		"Content-Security-Policy",
		[...cspDirectives, `script-src 'self' 'nonce-${nonce}'`].join("; "),
	];
}

// Opt the document into the JS Self-Profiling API so Sentry's browser profiling
// integration can sample. A no-op in browsers without the API (Firefox, Safari),
// so it is safe to send unconditionally.
function buildDocumentPolicy(): [name: string, value: string] {
	return ["Document-Policy", "js-profiling"];
}

// HTML documents carry a per-request nonce and authenticated state; never let a
// shared cache hold onto them.
function buildCacheControl(): [name: string, value: string] {
	return ["Cache-Control", "no-store"];
}

// Adding a document header is a new entry here, not another edit to the
// middleware body.
const documentHeaders: DocumentHeader[] = [
	buildContentSecurityPolicy,
	buildDocumentPolicy,
	buildCacheControl,
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
		const nonce = btoa(
			String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))),
		);
		const body = html.replace(/<script(?=[\s>])/g, `<script nonce="${nonce}"`);
		const headers = new Headers(response.headers);
		for (const build of documentHeaders) {
			const [name, value] = build(nonce);
			headers.set(name, value);
		}
		// `response.text()` already decoded the body, so the length and any
		// encoding headers from the original response no longer describe it.
		// Leaving them would make clients try to decode an already-decoded body.
		headers.delete("content-length");
		headers.delete("content-encoding");
		headers.delete("transfer-encoding");

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

// Sentry middleware go first in each list so the request span wraps the
// csrf/header request middleware and the function span wraps the auth function
// middleware, rather than nesting inside them.
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
