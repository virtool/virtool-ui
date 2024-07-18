import { LoadingPlaceholder } from "@/base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { resetClient } from "@utils/utils";
import { WallContainer } from "@wall/Container";
import { useAuthentication, useRootQuery } from "@wall/Queries";
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./GlobalStyles";
import Main from "./Main";
import { theme } from "./theme";

const LazyFirstUser = React.lazy(() => import("../wall/FirstUser"));
const LazyLoginWall = React.lazy(() => import("../wall/LoginWall"));

function ConnectedApp() {
    const { data: rootData, isLoading: isRootLoading } = useRootQuery();
    const { authenticated, isLoading: isAuthLoading } = useAuthentication();

    if (isRootLoading || isAuthLoading) {
        return <LoadingPlaceholder />;
    }

    if (rootData.body.first_user) {
        return (
            <Suspense fallback={<WallContainer />}>
                <LazyFirstUser />
            </Suspense>
        );
    }

    if (!authenticated) {
        return (
            <Suspense fallback={<WallContainer />}>
                <LazyLoginWall />
            </Suspense>
        );
    }

    return <Main />;
}

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
