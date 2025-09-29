import "@app/style.css";
import * as Sentry from "@sentry/react";
import { withProfiler } from "@sentry/react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./nonce";

if (window.virtool.sentryDsn !== "SENTRY_DSN") {
    window.captureException = (error) => Sentry.captureException(error);

    Sentry.init({
        dsn: window.virtool.sentryDsn,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.3,
    });
} else {
    window.captureException = (error) => console.error(error);
}

// Reload the page if a preload error occurs.
// These errors occur when a new version of the app bundle is deployed and a
// requested chunk no longer exists on the server.
window.addEventListener("vite:preloadError", () => {
    window.location.reload();
});

const AppWithProfiler = withProfiler(App);

const container = document.getElementById("app-container");
const root = createRoot(container);

root.render(<AppWithProfiler />);
