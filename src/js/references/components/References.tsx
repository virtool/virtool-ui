import { useFetchSettings } from "@administration/queries";
import { Container, LoadingPlaceholder } from "@base";
import React from "react";
import { Redirect, Route, Switch } from "wouter";
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
            <Switch>
                <Route path="/settings/*" component={() => <Redirect to="/settings" replace />} />
                <Route path="/settings" component={ReferenceSettings} nest />
                <Route path="/:refId" component={ReferenceDetail} nest />
                <Route path="/" component={ReferenceList} nest />
            </Switch>
        </Container>
    );
}
