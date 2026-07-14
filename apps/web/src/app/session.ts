let armed = false;
let ended = false;

/**
 * Allow `endSession` to act.
 *
 * Called once an authenticated load has succeeded. Until then `endSession` is
 * inert, because a 401 does not yet mean a session was lost: the login wall and
 * the authenticated route guard both fetch the account and *expect* a 401 when
 * nobody is logged in. Without this, a first-time visitor would be told their
 * session ended, and the wall could reload itself in a loop.
 */
export function armSessionEnd(): void {
	armed = true;
}

/**
 * End the session and send the user to the login wall.
 *
 * Idempotent, and a no-op until `armSessionEnd` has run. The full document load
 * is what clears everything held in memory — the React Query cache, zustand
 * stores, and the SSE connection — the same way `resetClient` ends a
 * user-initiated logout.
 */
export function endSession(): void {
	if (!armed || ended) {
		return;
	}
	ended = true;

	const params = new URLSearchParams({ reason: "session-ended" });
	const { pathname, search } = window.location;

	if (!pathname.startsWith("/login")) {
		params.set("redirect", `${pathname}${search}`);
	}

	window.sessionStorage.clear();
	window.location.assign(`/login?${params.toString()}`);
}
