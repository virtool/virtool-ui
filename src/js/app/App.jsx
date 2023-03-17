import { ConnectedRouter } from "connected-react-router";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { connect, Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { WallContainer } from "../wall/Container";
import Reset from "../wall/Reset";
import { GlobalStyles } from "./GlobalStyles";
import Main from "./Main";
import { theme } from "./theme";

const LazyFirstUser = React.lazy(() => import("../wall/FirstUser"));
const LazyLogin = React.lazy(() => import("../wall/Login"));

function App({ first, login, reset }) {
    if (first) {
        return (
            <Suspense fallback={<WallContainer />}>
                <LazyFirstUser />
            </Suspense>
        );
    }

    if (login) {
        return (
            <Suspense fallback={<WallContainer />}>
                <LazyLogin />
            </Suspense>
        );
    }

    if (reset) {
        return <Reset />;
    }

    return <Main />;
}

function mapStateToProps(state) {
    const { first, login, reset } = state.app;
    return {
        first,
        login,
        reset
    };
}

const ConnectedApp = connect(mapStateToProps)(App);

const queryClient = new QueryClient();

export default ({ store, history }) => {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <GlobalStyles />
                        <ConnectedApp />
                    </ConnectedRouter>
                </Provider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};
