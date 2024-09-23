import { Container, LoadingPlaceholder } from "@/base";
import { useFetchAccount } from "@account/queries";
import NavBar from "@nav/components/NavBar";
import { NavContainer } from "@nav/components/NavContainer";
import Sidebar from "@nav/components/Sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { includes } from "lodash-es";
import React, { lazy, Suspense, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import styled from "styled-components";
import { Redirect, Route as WouterRoute, Switch as WouterSwitch } from "wouter";
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
                    <WouterSwitch>
                        <WouterRoute path="/" component={() => <Redirect to="/samples" />} />
                        <WouterRoute path="/administration" component={Administration} nest />
                        <WouterRoute path="/account" component={Account} nest />
                        <WouterRoute path="/hmm" component={HMM} nest />
                        <WouterRoute path="/jobs" component={Jobs} nest />
                        <WouterRoute path="/ml" component={ML} nest />
                        <WouterRoute path="/refs" component={References} nest />
                        <WouterRoute path="/samples" component={Samples} nest />
                        <WouterRoute path="/subtractions" component={Subtraction} nest />
                    </WouterSwitch>
                </Suspense>
            </MainContainer>

            <Sidebar administratorRole={data.administrator_role} />

            <DevDialog />
            <UploadOverlay />
        </>
    );
}
