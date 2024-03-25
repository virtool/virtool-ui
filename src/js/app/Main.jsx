import { Container, LoadingPlaceholder } from "@/base";
import { getAccount } from "@account/actions";
import { getSettings } from "@administration/actions";
import { NavContainer } from "@nav/components/NavContainer";
import { useQueryClient } from "@tanstack/react-query";
import { includes } from "lodash-es";
import React, { lazy, Suspense, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import DevDialog from "../dev/components/Dialog";
import UploadOverlay from "../files/components/UploadOverlay";
import MessageBanner from "../message/components/MessageBanner";
import NavBar from "../nav/components/NavBar";
import Sidebar from "../nav/components/Sidebar";

import WSConnection, { ABANDONED, INITIALIZING } from "./websocket/WSConnection";

const Administration = lazy(() => import("../administration/components/Settings"));
const Account = lazy(() => import("../account/components/Account"));
const HMM = lazy(() => import("../hmm/components/HMM"));
const Jobs = lazy(() => import("../jobs/components/Jobs"));
const References = lazy(() => import("../references/components/References"));
const Samples = lazy(() => import("../samples/components/Samples"));
const Subtraction = lazy(() => import("../subtraction/components/Subtraction"));
const ML = lazy(() => import("../ml/components/ML"));

const setupWebSocket = queryClient => {
    if (!window.ws) {
        window.ws = new WSConnection(window.store, queryClient);
    }
    if (includes([ABANDONED, INITIALIZING], window.ws.connectionStatus)) {
        window.ws.establishConnection();
    }
};
const Fallback = () => (
    <Container>
        <LoadingPlaceholder />
    </Container>
);

const MainContainer = styled.div`
    padding-top: 80px;
`;

export const Main = ({ ready, onLoad }) => {
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!ready) onLoad();
    }, [ready]);
    useEffect(() => {
        if (ready) setupWebSocket(queryClient);
    }, [ready]);
    if (ready) {
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
                    <NavBar />
                </NavContainer>

                <MainContainer>
                    <Suspense fallback={<Fallback />}>
                        <Switch>
                            <Redirect from="/" to="/samples" exact />
                            <Route path="/jobs" component={Jobs} />
                            <Route path="/samples" component={Samples} />
                            <Route path="/refs" component={References} />
                            <Route path="/hmm" component={HMM} />
                            <Route path="/subtractions" component={Subtraction} />
                            <Route path="/administration" component={Administration} />
                            <Route path="/account" component={Account} />
                            <Route path="/ml" component={ML} />
                        </Switch>
                    </Suspense>
                </MainContainer>

                <Sidebar />

                <DevDialog />
                <UploadOverlay />
            </>
        );
    }

    return <LoadingPlaceholder />;
};

export const mapStateToProps = state => {
    return {
        ready: state.account.ready && Boolean(state.settings.data),
    };
};

export const mapDispatchToProps = dispatch => ({
    onLoad: () => {
        dispatch(getAccount());
        dispatch(getSettings());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
