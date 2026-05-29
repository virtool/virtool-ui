/// <reference types="vite/client" />
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// Browser-side Sentry initialisation lives in `router.tsx`'s `getRouter()` so it
// can wire `tanstackRouterBrowserTracingIntegration` to the router instance.

// Reload the page if a preload error occurs. These errors happen when a new
// version of the app bundle is deployed and a requested chunk no longer exists
// on the server.
window.addEventListener("vite:preloadError", () => {
	window.location.reload();
});

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<StartClient />
		</StrictMode>,
	);
});
