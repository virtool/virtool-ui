import * as Sentry from "@sentry/react";
import { withProfiler } from "@sentry/react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./nonce";
import "./style.css";

if (window.virtool.sentryDsn !== "SENTRY_DSN") {
    window.captureException = error => Sentry.captureException(error);

    Sentry.init({
        dsn: window.virtool.sentryDsn,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.3,
    });
} else {
    window.captureException = error => console.error(error);
}

window.virtool.b2c = { use: false };

const AppWithProfiler = withProfiler(App);

const container = document.getElementById("app-container");
const root = createRoot(container);
root.render(<AppWithProfiler />);
