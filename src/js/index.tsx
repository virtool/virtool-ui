import * as Sentry from "@sentry/react";
import { withProfiler } from "@sentry/react";
import { createBrowserHistory } from "history";
import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import { createAppStore } from "./app/reducer";
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
window.store = createAppStore(history);

const AppWithProfiler = withProfiler(App);

ReactDOM.render(<AppWithProfiler store={window.store} history={history} />, document.getElementById("app-container"));
