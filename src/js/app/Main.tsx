import { Container, LoadingPlaceholder } from "@/base";
import { useFetchAccount } from "@account/queries";
import NavBar from "@nav/components/NavBar";
import { NavContainer } from "@nav/components/NavContainer";
import Sidebar from "@nav/components/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { includes } from "lodash-es";
import React, { lazy, Suspense, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Redirect, Route, Switch } from "react-router-dom";
import { CompatRoute } from "react-router-dom-v5-compat";
import styled from "styled-components";
import DevDialog from "../dev/components/DeveloperDialog";
import UploadOverlay from "../files/components/UploadOverlay";
import MessageBanner from "../message/components/MessageBanner";
import WSConnection, { ABANDONED, INITIALIZING } from "./websocket/WSConnection";

const Administration = lazy(() => import("../administration/components/Settings"));
const Account = lazy(() => import("@account/components/Account"));
const HMM = lazy(() => import("../hmm/components/HMM"));
const Jobs = lazy(() => import("../jobs/components/Jobs"));
const References = lazy(() => import("@references/components/References"));
const Samples = lazy(() => import("../samples/components/Samples"));
const Subtraction = lazy(() => import("../subtraction/components/Subtraction"));
const ML = lazy(() => import("../ml/components/ML"));

function setupWebSocket(queryClient) {
    if (!window.ws) {
        window.ws = new WSConnection(queryClient);
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

            <NavContainer>
                <MessageBanner />
                <NavBar administrator_role={data.administrator_role} handle={data.handle} />
            </NavContainer>

            <MainContainer>
                <Suspense fallback={<Fallback />}>
                    <Switch>
                        <Redirect from="/" to="/samples" exact />
                        <Route path="/jobs" component={Jobs} />
                        <CompatRoute path="/samples" component={Samples} />
                        <Route path="/refs" component={References} />
                        <CompatRoute path="/hmm" component={HMM} />
                        <CompatRoute path="/subtractions" component={Subtraction} />
                        <Route path="/administration" component={Administration} />
                        <CompatRoute path="/account" component={Account} />
                        <Route path="/ml" component={ML} />
                    </Switch>
                </Suspense>
            </MainContainer>

            <Sidebar administratorRole={data.administrator_role} />

            <DevDialog />
            <UploadOverlay />
        </>
    );
}
