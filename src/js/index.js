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
}
const sentryInit = res => {
    const dev = res.body.dev;
    if (!dev) {
        Sentry.init({
            dsn: "https://d9ea493cb0f34ad4a141da5506e6b03b@sentry.io/220541"
        });

        window.Sentry = Sentry;
    }
    return res;
};

window.captureException = error => (window.virtool.dev ? console.error(error) : window.Sentry.captureException(error));
const history = createBrowserHistory();
window.store = createAppStore(history);

Request.get("/api")
    .then(sentryInit)
    .then(({ body }) => window.store.dispatch(setInitialState(body)));

ReactDOM.render(<App store={window.store} history={history} />, document.getElementById("app-container"));
