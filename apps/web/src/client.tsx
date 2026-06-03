/// <reference types="vite/client" />
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// Browser-side Sentry initialisation lives in `router.tsx`'s `getRouter()` so it
// can wire `tanstackRouterBrowserTracingIntegration` to the router instance.

// Reload the page if a preload error occurs. These errors happen when a new
// version of the app bundle is deployed and a requested chunk no longer exists
// on the server. The version prompt usually pre-empts this; the listener is a
// fallback for navigations that race it. A sessionStorage guard caps it at one
// reload per session so a genuinely missing chunk surfaces the error instead of
// looping.
const PRELOAD_RELOAD_KEY = "vt-preload-reloaded";

function handlePreloadError() {
	// sessionStorage can throw in Safari private mode or under storage-restriction
	// policies. If it does, skip the guard and reload anyway rather than swallow
	// the error and leave the user on a broken page.
	try {
		if (window.sessionStorage.getItem(PRELOAD_RELOAD_KEY)) {
			return;
		}
		window.sessionStorage.setItem(PRELOAD_RELOAD_KEY, "1");
	} catch {
		// Ignore and fall through to the reload.
	}
	window.location.reload();
}

window.addEventListener("vite:preloadError", handlePreloadError);

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<StartClient />
		</StrictMode>,
	);
});
