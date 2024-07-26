import * as Sentry from "@sentry/react";
import { withProfiler } from "@sentry/react";
import { createBrowserHistory } from "history";
import "normalize.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./nonce";

if (window.virtool.sentryDsn !== "SENTRY_DSN") {
    window.captureException = error => Sentry.captureException(error);

    Sentry.init({
        dsn: window.virtool.sentryDsn,
        integrations: [new Sentry.BrowserTracing()],
        tracesSampleRate: 0.5,
    });
} else {
    window.captureException = error => console.error(error);
}

const history = createBrowserHistory();

window.virtool.b2c = { use: false };

const AppWithProfiler = withProfiler(App);

const container = document.getElementById("app-container");
const root = createRoot(container);
root.render(<AppWithProfiler history={history} />);
