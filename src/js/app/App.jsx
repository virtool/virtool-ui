import { ConnectedRouter } from "connected-react-router";
import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { connect, Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { useFetchAccount } from "../account/querys";
import { LoadingPlaceholder } from "../base";
import { useFetchFirstUser } from "../users/hooks";
import { resetClient } from "../utils/utils";
import { WallContainer } from "../wall/Container";
import { Reset } from "../wall/Reset";
import { getInitialState } from "./actions";
import { GlobalStyles } from "./GlobalStyles";
import Main from "./Main";
import { theme } from "./theme";

const LazyFirstUser = React.lazy(() => import("../wall/FirstUser"));
const LazyLogin = React.lazy(() => import("../wall/Login"));

function mapStateToProps(state) {
    const { reset, ready } = state.app;
    return {
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
)(({ reset, ready, getInitialState }) => {
    useEffect(getInitialState, []);
    const { data: create_first } = useFetchFirstUser();
    const { data: fetch_account } = useFetchAccount();
    if (!ready) {
        return <LoadingPlaceholder />;
    }
    if (create_first.first_user) {
        return (
            <Suspense fallback={<WallContainer />}>
                <LazyFirstUser />
            </Suspense>
        );
    }

    if (fetch_account === undefined) {
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
                // if (error.response.status === 401) {
                //     return false;
                // }
                return failureCount <= 3;
            },
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
