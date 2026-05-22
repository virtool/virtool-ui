/// <reference types="vite/client" />
import * as Sentry from "@sentry/react";
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

const sentryDsn = import.meta.env.VT_SENTRY_DSN;

if (sentryDsn) {
	Sentry.init({
		dsn: sentryDsn,
		integrations: [Sentry.browserTracingIntegration()],
		tracesSampleRate: 0.3,
	});
}

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
