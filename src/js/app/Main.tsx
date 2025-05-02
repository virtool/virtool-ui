import { useFetchAccount } from "@account/queries";
import Container from "@base/Container";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Nav from "@nav/components/Nav";
import Sidebar from "@nav/components/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { includes } from "lodash-es";
import React, { lazy, Suspense, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import styled from "styled-components";
import { Redirect, Route, Switch } from "wouter";
import DevDialog from "../dev/components/DeveloperDialog";
import UploadOverlay from "../files/components/UploadOverlay";
import MessageBanner from "../message/components/MessageBanner";
import WsConnection, {
    ABANDONED,
    INITIALIZING,
} from "./websocket/WsConnection";

const Administration = lazy(
    () => import("../administration/components/Settings"),
);
const Account = lazy(() => import("@account/components/Account"));
const HMM = lazy(() => import("../hmm/components/HMM"));
const Jobs = lazy(() => import("../jobs/components/Jobs"));
const References = lazy(() => import("@references/components/References"));
const Samples = lazy(() => import("../samples/components/Samples"));
const Subtraction = lazy(() => import("../subtraction/components/Subtraction"));
const ML = lazy(() => import("../ml/components/ML"));

function setupWebSocket(queryClient) {
    if (!window.ws) {
        window.ws = new WsConnection(queryClient);
    }
    if (includes([ABANDONED, INITIALIZING], window.ws.connectionStatus)) {
        window.ws.establishConnection();
    }
}

function Fallback() {
    return (
        <Container>
            <LoadingPlaceholder />
        </Container>
    );
}

const MainContainer = styled.div`
    padding-top: 80px;
`;

/**
 * The main component of the application.
 * Sets up the WebSocket connection, handles routing, and renders the main layout.
 */
export default function Main() {
    const queryClient = useQueryClient();
    const { data, isPending } = useFetchAccount();

    useEffect(() => {
        if (data) {
            setupWebSocket(queryClient);
        }
    }, [data]);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Virtool</title>
                    <meta charSet="utf-8" />
                </Helmet>
            </HelmetProvider>

            <div className="bg-transparent fixed top-0 w-full z-50">
                <MessageBanner />
                <Nav
                    administrator_role={data.administrator_role}
                    handle={data.handle}
                />
            </div>

            <MainContainer>
                <Suspense fallback={<Fallback />}>
                    <Switch>
                        <Route
                            path="/"
                            component={() => <Redirect to="/samples" />}
                        />
                        <Route
                            path="/administration/*?"
                            component={Administration}
                        />
                        <Route path="/account/*?" component={Account} />
                        <Route path="/hmm/*?" component={HMM} />
                        <Route path="/jobs/*?" component={Jobs} />
                        <Route path="/ml/*?" component={ML} />
                        <Route path="/refs/*?" component={References} />
                        <Route path="/samples/*?" component={Samples} />
                        <Route
                            path="/subtractions/*?"
                            component={Subtraction}
                        />
                    </Switch>
                </Suspense>
            </MainContainer>

            <Sidebar administratorRole={data.administrator_role} />

            <DevDialog />
            <UploadOverlay />
        </>
    );
}
