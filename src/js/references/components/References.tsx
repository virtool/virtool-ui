import { useFetchSettings } from "@administration/queries";
import { Container, LoadingPlaceholder } from "@base";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { Routes } from "react-router-dom-v5-compat";
import ReferenceDetail from "./Detail/ReferenceDetail";
import ReferenceList from "./ReferenceList";
import { ReferenceSettings } from "./ReferenceSettings";

/**
 * The references view with routes to reference-related components
 */
export default function References() {
    const { isPending } = useFetchSettings();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <Container>
            <Routes>
                <Route path="/refs" component={ReferenceList} exact />
                <Route path="/refs/settings/*" render={() => <Redirect to="/refs/settings" />} />
                <Route path="/refs/settings" component={ReferenceSettings} />
                <Route path="/refs/:refId" component={ReferenceDetail} />
            </Routes>
        </Container>
    );
}
