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
import { PublicClientApplication } from "@azure/msal-browser";
import { getMsalConfig } from "./app/authConfig";

if (module.hot) {
    module.hot.accept(err => {
        throw err;
    });
    window.virtool.sentryDSN = null;
    window.b2c = {
        use: false,
        userflow: "",
        tenant: "",
        clientId: "",
        scope: "",
        APIClientId: ""
    };
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

window.captureException = error => (window.virtool.dev ? console.error(error) : Sentry.captureException(error));

const history = createBrowserHistory();
window.store = createAppStore(history);

Request.get("/api")
    .then(sentryCheck)
    .then(({ body }) => {
        window.virtool.dev = body.dev;
        window.store.dispatch(setInitialState(body));
    });

window.msalInstance = window.b2c.use ? new PublicClientApplication(getMsalConfig()) : null;

ReactDOM.render(<App store={window.store} history={history} />, document.getElementById("app-container"));
