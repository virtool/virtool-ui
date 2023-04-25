import * as Sentry from "@sentry/react";
import { withProfiler } from "@sentry/react";
import { createBrowserHistory } from "history";
import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { setInitialState } from "./app/actions";
import App from "./app/App";
import { createAppStore } from "./app/reducer";
import { Request } from "./app/request";
import "./nonce";

if (window.virtool.sentryDsn !== "SENTRY_DSN") {
    window.captureException = error => Sentry.captureException(error);

    Sentry.init({
        dsn: window.virtool.sentryDsn,
        integrations: [new Sentry.BrowserTracing()],
        tracesSampleRate: 0.5
    });
} else {
    window.captureException = error => console.error(error);
}

const history = createBrowserHistory();

window.b2c = { use: false };
window.store = createAppStore(history);

Request.get("/api").then(({ body }) => {
    window.store.dispatch(setInitialState(body));
});

const AppWithProfiler = withProfiler(App);

ReactDOM.render(<AppWithProfiler store={window.store} history={history} />, document.getElementById("app-container"));
