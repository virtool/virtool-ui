import { LoadingPlaceholder } from "@/base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { resetClient } from "@utils/utils";
import { WallContainer } from "@wall/Container";
import React, { Suspense, useEffect } from "react";
import { connect, Provider } from "react-redux";
import { Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import LoginWall from "../wall/LoginWall";
import { getInitialState } from "./actions";
import { GlobalStyles } from "./GlobalStyles";
import Main from "./Main";
import { theme } from "./theme";

const LazyFirstUser = React.lazy(() => import("../wall/FirstUser"));

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

    if (login || reset) {
        return <LoginWall />;
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
                if (error.response.status === 401 || error.response.status === 404 || error.response.status === 403) {
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
                    <Router history={history}>
                        <GlobalStyles />
                        <ConnectedApp />
                    </Router>
                </Provider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
