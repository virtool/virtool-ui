import * as Sentry from "@sentry/browser";
import { createBrowserHistory } from "history";
import "./nonce";
import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import { createAppStore } from "./app/reducer";
import { Request } from "./app/request";
import { setInitialState } from "./app/actions";

window.captureException = error => console.error(error);

if (window.__sentry_dsn__ !== "SENTRY_DSN") {
    window.captureException = error => Sentry.captureException(error);

    Sentry.init({
        dsn: window.__sentry_dsn__
    });
}

const history = createBrowserHistory();

window.b2c = { use: false };

window.store = createAppStore(history);

Request.get("/api").then(({ body }) => {
    window.store.dispatch(setInitialState(body));
});

ReactDOM.render(<App store={window.store} history={history} />, document.getElementById("app-container"));
