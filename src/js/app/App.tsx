import { LoadingPlaceholder } from "@/base";
import { ErrorBoundary } from "@app/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { resetClient } from "@/utils";
import { useAuthentication, useRootQuery } from "@wall/queries";
import React, { Suspense } from "react";
import { ThemeProvider } from "styled-components";
import { Router } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import Main from "./Main";
import { theme } from "./theme";

// Lazy load components
const LazyFirstUser = React.lazy(() => import("@wall/components/FirstUser"));
const LazyLoginWall = React.lazy(() => import("@wall/components/LoginWall"));

/** The main application component that handles authentication and routing */
function ConnectedApp(): React.ReactElement {
    const { data: rootData, isPending: isRootPending } = useRootQuery();
    const { authenticated, isPending: isAuthPending } = useAuthentication();

    if (isRootPending || isAuthPending) {
        return <LoadingPlaceholder />;
    }

    if (rootData.first_user) {
        return (
            <Suspense fallback={<div />}>
                <LazyFirstUser />
            </Suspense>
        );
    }

    if (!authenticated) {
        return (
            <Suspense fallback={<div />}>
                <LazyLoginWall />
            </Suspense>
        );
    }

    return <Main />;
}

// Query client setup with default options and error handling
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount: number, error: any) => {
                if ([403, 404].includes(error.response?.status)) {
                    return false;
                }
                if (error.response?.status === 401) {
                    resetClient();
                }
                return failureCount <= 3;
            },
            staleTime: 2000,
        },
    },
});

/** The root App component that provides theme, query client, and routing setup */
export default function App(): React.ReactElement {
    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <Router hook={useBrowserLocation}>
                        <ConnectedApp />
                    </Router>
                </QueryClientProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}
