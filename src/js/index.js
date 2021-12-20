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

if (module.hot) {
    module.hot.accept(err => {
        throw err;
    });
    window.virtool.sentryDSN = "https://d9ea493cb0f34ad4a141da5506e6b03b@sentry.io/220541";
}

Sentry.init({
    dsn: window.virtool.sentryDSN
});

const sentryCheck = res => {
    if (res.body.dev) {
        Sentry.close();
    }
    return res;
};

window.captureException = error => (window.virtool.dev ? console.error(error) : window.Sentry.captureException(error));
const history = createBrowserHistory();
window.store = createAppStore(history);

Request.get("/api")
    .then(sentryCheck)
    .then(({ body }) => {
        window.virtool.dev = body.dev;
        window.store.dispatch(setInitialState(body));
    });

ReactDOM.render(<App store={window.store} history={history} />, document.getElementById("app-container"));
