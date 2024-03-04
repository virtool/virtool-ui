import { ConnectedRouter } from "connected-react-router";
import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { connect, Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { LoadingPlaceholder } from "../base";
import { resetClient } from "../utils/utils";
import { WallContainer } from "../wall/Container";
import Reset from "../wall/Reset";
import { getInitialState } from "./actions";
import { GlobalStyles } from "./GlobalStyles";
import Main from "./Main";
import { theme } from "./theme";

const LazyFirstUser = React.lazy(() => import("../wall/FirstUser"));
const LazyLogin = React.lazy(() => import("../wall/Login"));

function mapStateToProps(state) {
    const { first, login, reset, ready } = state.app;
    return {
        first,
        login,
        reset,
        ready,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getInitialState: () => {
            dispatch(getInitialState());
        },
    };
}

const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps,
)(({ first, login, reset, ready, getInitialState }) => {
    useEffect(getInitialState, []);
    if (!ready) {
        return <LoadingPlaceholder />;
    }

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
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            onError: error => {
                if (error.response.status === 401) {
                    resetClient();
                }
            },
            retry: (failureCount, error) => {
                if (error.response.status === 401 || error.response.status === 404) {
                    return false;
                }
                return failureCount <= 3;
            },
            staleTime: 2000,
        },
    },
});

export default function App({ store, history }) {
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
}
