import { createIsomorphicFn } from "@tanstack/react-start";

/**
 * Name of the `<meta>` tag that carries the runtime Sentry DSN to the browser.
 */
export const SENTRY_DSN_META_NAME = "vt-sentry-dsn";

function readDsnFromMeta(): string {
	return (
		document
			.querySelector(`meta[name="${SENTRY_DSN_META_NAME}"]`)
			?.getAttribute("content") ?? ""
	);
}

// `process` has no type in the app TypeScript project (DOM lib, no Node types),
// and this module is client-reachable. Reach the runtime env through `globalThis`
// with a local shape so the read type-checks without dragging Node globals in;
// the `.server` body below is stripped from the client bundle regardless.
function readDsnFromEnv(): string {
	const proc = (
		globalThis as { process?: { env?: Record<string, string | undefined> } }
	).process;
	return proc?.env?.VT_SENTRY_DSN ?? "";
}

/**
 * The runtime Sentry DSN. On the server it is read from `process.env` at
 * request time; on the client it is read back from the `<meta>` tag the server
 * rendered into the document head. Reading it this way — rather than from a
 * build-time `import.meta.env.VT_SENTRY_DSN` inline — keeps the DSN out of the
 * client bundle, so a single image picks up whatever DSN the runtime env
 * provides, and yields an identical value on server and client (no hydration
 * mismatch).
 */
export const readSentryDsn = createIsomorphicFn()
	.server(readDsnFromEnv)
	.client(readDsnFromMeta);
