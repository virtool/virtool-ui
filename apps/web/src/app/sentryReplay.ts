import { getClient } from "@sentry/tanstackstart-react";

// Session Replay is the single largest piece of the Sentry payload. Registering
// it through `Sentry.init`'s `integrations` array pulls `@sentry/replay` and
// `@sentry/replay-canvas` into the eager bundle, so every visitor — including an
// unauthenticated one who only ever sees the login wall — pays for it before
// first paint.
//
// Deferring to idle keeps recording behaviour identical: the sampled full
// session and the always-on error buffer both still run, they just start once
// the browser is done with the work that matters. The only cost is that an error
// thrown in the first moments after load has a shorter buffer behind it.
//
// Replay is imported from `@sentry/replay` rather than the `@sentry/tanstackstart-react`
// barrel on purpose. The barrel is already in the eager graph (`router.tsx`
// imports `init` from it), so a dynamic import of *that* specifier resolves to
// the eager chunk and Rolldown collapses the boundary — it re-exports Replay
// statically and the deferral silently does nothing. Importing the package the
// integration actually lives in is what makes the chunk async. `vite.config.js`
// keeps `@sentry/replay*` in its own chunk group to match.
async function loadReplay(): Promise<void> {
	const { replayIntegration } = await import("@sentry/replay");
	getClient()?.addIntegration(replayIntegration());
}

export function scheduleReplay(): void {
	function start() {
		// A failed Replay load must never take the app down with it.
		loadReplay().catch(() => {});
	}

	if (typeof requestIdleCallback === "function") {
		requestIdleCallback(start);
		return;
	}

	setTimeout(start, 0);
}
