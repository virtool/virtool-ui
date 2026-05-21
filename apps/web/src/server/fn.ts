import { createServerFn as createServerFnUpstream } from "@tanstack/react-start";

import { authMiddleware } from "./auth/middleware";

/**
 * Project-local `createServerFn` that always gates the handler behind an
 * authenticated session. Handlers receive `context.session` with the resolved
 * user. Import this in place of `@tanstack/react-start`'s `createServerFn`.
 */
export function createServerFn(
	...args: Parameters<typeof createServerFnUpstream>
) {
	return createServerFnUpstream(...args).middleware([authMiddleware]);
}

/**
 * Escape hatch for endpoints that necessarily precede a session (login,
 * forced password reset). Loudly named so call sites are easy to audit; do
 * not use for anything else.
 */
export { createServerFnUpstream as createUnauthenticatedServerFn };
